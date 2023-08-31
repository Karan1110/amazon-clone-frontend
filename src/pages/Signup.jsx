import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

const Signup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create a user object with the form data
    const user = {
      name,
      email,
      password,
      pinCode,
    }

    try {
      const response = await fetch("http://localhost:3900/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      const data = await response.json()
      console.log(data)

      if (response.ok) {
        // Sign-up successful, redirect to the homepage
        localStorage.setItem("token", data.token)
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: data.user._id,
            name: data.user.name,
          })
        )

        if (location.state?.from) {
          navigate(location.state.from)
        } else {
          // If there's no original location, navigate to a default page
          navigate("/")
        }
      } else {
        // Sign-up failed, show the error message in an alert
        setError(data.message)
      }
    } catch (error) {
      setError("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl text-center text-pink-800 font-bold mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-pink-600 font-semibold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-pink-600 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-pink-600 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="pinCode"
              className="block text-pink-600 font-semibold mb-2"
            >
              Enter Pin Code
            </label>
            <input
              type="password"
              id="pinCode"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-2xl hover:bg-pink-700 transition duration-300"
          >
            Sign Up
          </button>
          <Link to="/login">
            <p className="text-semibold mt-4 text-pink-500">
              Already have an account? click here to login
            </p>
          </Link>
        </form>
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mt-2 rounded-2xl text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Signup
