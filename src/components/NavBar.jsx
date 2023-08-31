import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShoppingCart,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons"
import useStore from "../store/index"

const NavBar = () => {
  const history = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false)
  const cart = useStore((state) => state.cartItems)
  const products = useStore((state) => state.products)
  function getProductByTitle(title) {
    const product = products.find(
      (product) => product.title.toLowerCase() === title.toLowerCase()
    )
    return product || null
  }

  const handleCartIconClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  async function handleCheckout() {
    const url = "http://localhost:3900/api/checkout/cart"

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      }
      const response = await fetch(url, requestOptions)
      if (!response.ok) {
        console.log("error")
      }

      // If successful, return the success_url from the response data
      const responseData = await response.json()
      // console.log(responseData)
      window.location = responseData.url
    } catch (error) {
      // Handle any other errors that may occur during the fetch
      console.error("Error occurred while fetching data:", error)
    }
  }

  const handleSearch = () => {
    const product = getProductByTitle(searchValue)
    if (product !== null) {
      history(`/product/${product._id}`)
    }
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)

    const suggestions = [
      { title: "Sneakers" },
      { title: "Nike Sneakers" },
      { title: "Shirts" },
    ]
    setSearchSuggestions(
      suggestions.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      )
    )
  }
  const handleTrendingClick = () => {
    // Use smooth scrolling to scroll to the trending section
    document.getElementById("trending").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  const handleTopClick = () => {
    // Use smooth scrolling to scroll to the trending section
    document.getElementById("top").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  const handleProductsClick = () => {
    // Use smooth scrolling to scroll to the trending section
    document.getElementById("products").scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
  useEffect(() => {
    // Simulate loading the sidebar content
    console.log(cart)
    setIsLoadingSidebar(true)
    setTimeout(() => {
      setIsLoadingSidebar(false)
    }, 1000)
  }, [isSidebarOpen])

  return (
    <nav className="bg-white p-2 shadow-2xl  ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/profile">
            <FontAwesomeIcon
              icon={faUser}
              className="text-pink-800 text-lg ml-5 mr-15 mt-5 mb-5"
            />
          </Link>
          {/* Cart Icon */}
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-pink-800 text-lg m-5 cursor-pointer"
            onClick={handleCartIconClick}
          />
          {/* User Icon */}
          <input
            type="text"
            className="border border-pink-700 focus:border-pink-900 rounded-2xl p-3 pl-4 pr-12 shadow-sm text-pink-800 placeholder-pink-600 focus:outline-none text-lg"
            placeholder="Search products"
            value={searchValue}
            onChange={handleSearchInputChange}
            list="suggestionsList"
          />
          <button
            className="bg-pink-500 text-white rounded-2xl px-4 py-2 hover:bg-pink-600 transition duration-300"
            onClick={handleSearch}
          >
            Search
          </button>
          <datalist id="suggestionsList">
            {/* Map over the searchSuggestions array and display suggestions */}
            {searchSuggestions.map((suggestion, index) => (
              <option key={index} value={suggestion.title} />
            ))}
          </datalist>
          <Link to="/">
            <h3 className="text-center text-pink-900 text-xl font-bold">
              Our Products
            </h3>
          </Link>
          <Link to="/login">
            <h3 className="text-center text-pink-900 text-xl font-bold">
              Login
            </h3>
          </Link>
          <Link to="/signup">
            <h3 className="text-center text-pink-900 text-xl font-bold">
              Sign Up
            </h3>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded-2xl font-bold hover:bg-pink-800 transition duration-300"
            onClick={handleTrendingClick}
          >
            Trending
          </button>
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded-2xl font-bold hover:bg-pink-800 transition duration-300"
            onClick={handleTopClick}
          >
            Best Selling Trending
          </button>
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded-2xl font-bold hover:bg-pink-800 transition duration-300"
            onClick={handleProductsClick}
          >
            All Products
          </button>
        </div>
      </div>
      {cart ? (
        <div
          className={`  overflow-y-auto fixed top-0 left-0 h-full w-64 bg-pink-200 p-4  shadow-lg  max-transition-transform max-w-64 duration-300 ${
            isSidebarOpen
              ? "transform translate-x-0"
              : "transform -translate-x-full ease-in"
          }`}
          style={{
            zIndex: 9999999,
            scrollbarWidth: "thin",
            scrollbarColor: "#f472b6 #f9a8d4",
          }}
        >
          <div className="flex relative sticky justify-end">
            <FontAwesomeIcon
              icon={faTimes}
              className="text-pink-800 text-lg cursor-pointer relative sticky"
              onClick={handleSidebarClose}
            />
          </div>

          <h2 className="text-pink-900 text-2xl font-bold m-4">Cart</h2>
          {isLoadingSidebar ? (
            <div className="p-4 flex items-center justify-center text-center ">
              <div
                className="border-t-4 border-pink-600 rounded-full animate-spin"
                style={{ height: "10vw", width: "10vw" }}
              ></div>
            </div>
          ) : (
            <div className="">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="border p-2 border-pink-500  m-2 rounded-2xl shadow-xl  "
                  style={{ width: "12vw", height: "13vw" }}
                >
                  <img
                    src={`http://localhost:3900/${
                      item.selectedForm
                        ? item.forms[item.selectedForm].image_filename
                        : item.forms[0].image_filename
                    }`}
                    className="h-100 w-full object-cover rounded-2xl"
                    style={{ width: "11vw", height: "120px" }}
                    alt="Product"
                  />

                  <div className="p-2">
                    <h3 className="text-pink-800 font-semibold m-1">
                      {item.title}
                    </h3>
                    <button className="bg-pink-500 text-white rounded-2xl px-4 py-2 hover:bg-pink-600 transition duration-300">
                      View More
                    </button>
                  </div>
                </div>
              ))}
              <h1 className="mt-5 ml-8 text-pink-900 text-xl font-bold">
                {" "}
                subtotal :{""}
                {cart.reduce((accumulator, product) => {
                  return accumulator + product.price
                }, 0)}
              </h1>
              <button
                className="bg-pink-500 relative ml-8 mr-5 mt-2 bottom-0 text-white rounded-2xl px-4 py-2 hover:bg-pink-600 transition duration-300"
                onClick={handleCheckout}
              >
                Check out.
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  )
}

export default NavBar
