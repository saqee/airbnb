import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
const PhotosUploader = ({ addedPhotos, onChange, data, dataHandle }) => {
  const [photoLink, setphotoLink] = useState("")
  async function addPhotoByLink(e) {
    e.preventDefault()
    const { data: filename } = await axios.post("/upload-by-link", {
      link: data.photoLink,
    })
    onChange((prev) => {
      return [...prev, filename]
    })
    setphotoLink("")
  }
  function uploadPhoto(ev) {
    ev.preventDefault()
    let newFiles = ev.target.files
    let formdata = new FormData()
    for (let i = 0; i <= newFiles.length; i++) {
      formdata.append("photo", newFiles[i])
    }
    axios
      .post("/uploads", formdata, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        const { data: filenames } = response
        onChange((prev) => {
          return [...prev, ...filenames]
        })
      })
  }
  return (
    <>
      <h2>Photos</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={data.photoLink}
          name="photoLink"
          onChange={dataHandle}
          placeholder={"Add using link...."}
        />
        <button
          className="bg-gray-200 px-4 rounded-2xl"
          onClick={addPhotoByLink}
        >
          add photo
        </button>
      </div>
      <div className="mt-2 grid grid-cols-6">
        {addedPhotos?.map((link) => (
          <div>
            <img
              src={`http://localhost:3001/uploads/${link}`}
              width="150"
              className="rounded-2xl"
            />
          </div>
        ))}
        <label
          htmlFor="checkbox_id"
          className="cursor-pointer border border-gray-300 p-2 rounded-full flex justify-center"
        >
          <input
            type="file"
            multiple
            id="checkbox_id"
            name="photo"
            className="hidden"
            onChange={uploadPhoto}
          />
          Upload
        </label>
      </div>
    </>
  )
}

export default PhotosUploader
