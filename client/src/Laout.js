import React from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./pages/Header"

const Laout = () => {
  return (
    <div className="py-6 px-8 flex flex-col min-h-screen ">
      <Header />
      <Outlet />
    </div>
  )
}

export default Laout
