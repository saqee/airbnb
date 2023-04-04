import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "./models/User.js"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import dwn from "image-downloader"
import multer from "multer"
import fs from "fs"
import Place from "./models/Place.js"
import Booking from "./models/Booking.js"
//import { fileURLToPath } from "url"
//import { dirname } from "path"

//const __filename = fileURLToPath(import.meta.url)
//const __dirname = dirname(__filename)
import path from "path"

const __dirname = path.resolve()

dotenv.config()
let app = express()
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + "/uploads/"))
function db() {
  mongoose.connect(process.env.MONGO_URL)
  console.log("db running")
}
db()
const salt = await bcrypt.genSalt(10)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body
  try {
    const userDoc = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, salt),
    })

    res.json(userDoc)
  } catch (e) {
    res.status(422).json(e)
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    const passOk = await bcrypt.compare(password, user.password)
    if (passOk) {
      jwt.sign({ email: user.email, id: user._id }, "saqeeb", (err, token) => {
        if (err) {
          throw err
        }
        res.cookie("token", token).json(user.name)
      })
    } else {
      res.status(422).json("password not okay")
    }
  }
})

app.get("/profile", async (req, res) => {
  let { token } = req.cookies
  if (token) {
    jwt.verify(token, "saqeeb", {}, async (err, user) => {
      let userInfo = await User.findById(user.id)
      res.json(userInfo)
    })
  } else {
    res.json("not valid token")
  }
})

app.get("/places", async (req, res) => {
  const { token } = req.cookies
  jwt.verify(token, "saqeeb", {}, async (err, user) => {
    let userInfo = await Place.find({ owner: user.id })
    res.json(userInfo)
  })
})

app.get("/place/:id", async (req, res) => {
  const { id } = req.params
  res.json(await Place.findById(id))
})

app.put("/places/:id", async (req, res) => {
  const { id } = req.params
  const { token } = req.cookies
  const { data, addedPhotos, perks } = req.body
  res.json(
    await Place.findByIdAndUpdate(id, {
      title: data.title,
      address: data.address,
      description: data.description,
      extraInfo: data.extraInfo,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      maxGuests: data.maxGuests,
      photos: addedPhotos,
      perks: perks,
    })
  )
  /* jwt.verify(token, "saqeeb", {}, async (err, user) => {
    res.json(
      await Place.findByIdAndUpdate(id, {
        title: data.title,
      })
    )
  }) */
})

app.get("/index-places", async (req, res) => {
  res.json(await Place.find())
})
app.get("/index-place/:id", async (req, res) => {
  let { id } = req.params
  res.json(await Place.findById(id.toString()))
})

app.post("/logout", async (req, res) => {
  res.cookie("token", "").json(true)
})

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body
  const newName = Date.now() + ".jpg"
  await dwn.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  })
  res.json(newName)
})
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true)
    console.log("image type correct")
  } else {
    console.log("image type incorrect")
    cb("error Message", false)
  }
}
const upload = multer({ storage: storage })
///this is object babu
//nicher line ta object nayyy bujhla :)
app.post("/uploads", upload.array("photo", 100), (req, res, next) => {
  let uploadFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i]
    /* const parts=originalname.split('.')
          const ext=parts[parts.length-1]
          let newath=path + '.' + ext
         fs.renameSync(path,newath) */
    uploadFiles.push(originalname)
  }
  res.json(uploadFiles)
})

app.post("/places", async (req, res) => {
  const { token } = req.cookies
  const { data, addedPhotos, perks } = req.body

  jwt.verify(token, "saqeeb", {}, async (err, user) => {
    if (err) {
      throw err
    }
    let placeDoc = await Place.create({
      owner: user.id,
      title: data.title,
      description: data.description,
      extraInfo: data.extraInfo,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      maxGuests: data.maxGuests,
      photos: addedPhotos,
      perks: perks,
    })
    res.json(placeDoc)
  })
})

app.post("/bookings", async (req, res) => {
  const { checkIn, checkOut, place, numberOfGuests, phone, name } = req.body
  Booking.create({
    checkIn,
    checkOut,
    place,
    numberOfGuests,
    phone,
    name,
  }).then((err, doc) => {
    res.json(doc)
  })
})

app.get("/bookings", async (req, res) => {
  res.json(Booking.findById())
})

app.listen(3001, () => {
  console.log("app running")
})
