import React, { useState, useEffect } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import Perks from "./Perks.js"
import axios from "axios"
import PhotosUploader from "./PhotosUploader.js"
const PlacesForm = () => {
  const { id } = useParams()

  const [addedPhotos, setAddedPhotos] = useState([])
  const [perks, setPerks] = useState([])
  const [data, setData] = useState({
    title: "",
    address: "",
    description: "",
    photoLink: "",
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: 1,
    price: 100,
  })
  /* const [title, setTitle] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [extraInfo, setExtraInfo] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [maxGuests, setMaxGuests] = useState(1)
  const [price, setPrice] = useState(100) */
  const [redirect, setRedirect] = useState(false)

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    )
  }

  function dataHandle(e) {
    let value = e.target.value
    setData({
      ...data,
      [e.target.name]: value,
    })
  }
  useEffect(() => {
    axios.get("/place/" + id).then(({ data }) => {
      setData(data)
      setPerks(data.perks)
    })
  }, [])
  async function dataSend(e) {
    e.preventDefault()
    if (id) {
      await axios.put("/places/" + id, { data, perks, addedPhotos })
      setRedirect(true)
    } else {
      await axios.post("/places", { data, addedPhotos, perks })
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />
  }

  return (
    <div>
      <form onSubmit={dataSend}>
        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={data.title}
          onChange={dataHandle}
          name="title"
          placeholder="title, for example: My lovely apt"
        />
        {preInput("Address", "Address to this place")}
        <input
          type="text"
          value={data.address}
          name="address"
          onChange={dataHandle}
          placeholder="address"
        />
        {preInput("Photos", "more = better")}
        <PhotosUploader
          addedPhotos={addedPhotos}
          onChange={setAddedPhotos}
          data={data}
          dataHandle={dataHandle}
        />
        {preInput("Description", "description of the place")}
        <textarea
          name="description"
          value={data.description}
          onChange={dataHandle}
        />
        {preInput("Perks", "select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra info", "house rules, etc")}
        <textarea
          name="extraInfo"
          value={data.extraInfo}
          onChange={dataHandle}
        />
        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              name="checkIn"
              value={data.checkIn}
              onChange={dataHandle}
              placeholder="14"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              name="checkOut"
              value={data.checkOut}
              onChange={dataHandle}
              placeholder="11"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              name="maxGuests"
              value={data.maxGuests}
              onChange={dataHandle}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={dataHandle}
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  )
}

export default PlacesForm
