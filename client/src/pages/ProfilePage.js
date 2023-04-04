import React, { useContext, useState } from "react"
import { UserContext } from "../UserContext.js"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios"
import Places from "./Places.js"
import AccountNav from "./AccountNav.js"

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null)
  const { ready, user, setUser } = useContext(UserContext)

  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = "profile"
  }

  if (ready && !user) {
    return <Navigate to="/login" />
  }
  async function logout() {
    await axios.post("/logout")
    setUser(null)
    setRedirect("/")
  }
  if (redirect) {
    return <Navigate to={redirect} />
  }
  if (!ready) {
    return "Loading..."
  }

  return (
    <div>
      <AccountNav />
      {user && subpage == "profile" && (
        <div className="text-center max-w-lg mx-auto mt-3">
          Logged in as {user.name}
          email {user.email}
          <br />
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {subpage == "places" && (
        <div>
          <Places />
        </div>
      )}
    </div>
  )
}

export default ProfilePage
