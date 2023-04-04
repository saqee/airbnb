import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
export const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    await axios.post("/register", {
      name,
      email,
      password,
    })
  }
  return (
    <div className="mt-4 grow  flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={handleRegisterSubmit}>
          <input
            type="text"
            placeholder="Jon_Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            have an account yet?{" "}
            <Link className="underline text-black" to={"/Login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
