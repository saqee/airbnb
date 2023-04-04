import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Header } from "./Header"
const IndexPage = () => {
  const [places, setPlaces] = useState([])
  useEffect(() => {
    axios.get("/index-places").then((response) => {
      setPlaces([...response.data])
    })
  }, [])

  return (
    <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={"/index-place/" + place._id}>
            <div className="bg-gray-500 rounded-2xl">
              {/* {place.photos?.length > 0 &&
                place.photos.map((phot) => (
                  <img
                    src={"http://localhost:3001/uploads/" + phot}
                    alt=""
                    srcset=""
                    className="rounded-2xl object-cover aspect-square"
                  />
                ))} */}
              {
                <img
                  src={"http://localhost:3001/uploads/" + place.photos[0]}
                  alt=""
                  srcset=""
                />
              }
            </div>
            <h2 className="text-sm truncate">{place.title}</h2>
            <h3 className="font-bold">{place.address}</h3>
            <div className="mt-2">
              <span className="font-bold"> $157.00 Per Night</span>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default IndexPage
