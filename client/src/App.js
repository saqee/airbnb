import axios from "axios"
import { Route, Routes } from "react-router-dom"
import Laout from "./Laout"
import IndexPage from "./pages/IndexPage"
import Login from "./pages/Login"
import Places from "./pages/Places"
import ProfilePage from "./pages/ProfilePage"
import PlacesForm from "./pages/PlacesForm"
import Place from "./pages/Place"
import { Register } from "./pages/Register"
import { UserContextProvider } from "./UserContext"
import PlacePage from "./pages/PlacePage"
import BookingsPage from "./pages/BookingsPage"
import BookingPage from "./pages/BookingPage"
function App() {
  axios.defaults.baseURL = "http://localhost:3001"
  axios.defaults.withCredentials = true
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Laout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<Places />} />
          <Route path="/account/places/:id" element={<PlacesForm />} />
          <Route path="/account/places/new" element={<PlacesForm />} />
          <Route path="/account/places/:action?" element={<Places />} />
          <Route path="/index-place/:id?" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
