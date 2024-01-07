import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faShoppingCart,
  faUser,
  faTimes,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"
import useStore from "../store/index"
import Cart from "./Cart"

const NavBar = () => {
  const history = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false)
  const cart = useStore((state) => state.cartItems)
  const user = useStore((state) => state.user)
  const [products, setProducts] = useState([])

  const getProductByTitle = async (title) => {
    try {
      const response = await fetch(
        `http://localhost:3900/api/products/title?title=${title}`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )

      if (!response.ok) {
        console.log("Error fetching products")
        return []
      }

      const data = await response.json()
      console.log(data)
      return data || []
    } catch (error) {
      console.error("Error occurred while fetching products:", error)
      return []
    }
  }
  const handleSuggestionClick = (productId) => {
    history(`/product/${productId}`)
  }

  // ...

  const handleSearchInputChange = async (e) => {
    const value = e.target.value
    setSearchValue(value)

    try {
      const products = await getProductByTitle(value)

      setSearchSuggestions(products)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }
  const handleCartIconClick = () => {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }
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

  const handleSearch = async () => {
    const product = await getProductByTitle(searchValue)
    console.log(product._id)
    console.log(product)
    if (product.length > 0) {
      history(`/product/${product[0]._id}`)
    }
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  const handleTrendingClick = () => {
    // Use smooth scrolling to scroll to the trending section
    const tp = document.getElementById("trending")
    if (tp) {
      tp.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
  const handleTopClick = () => {
    // Use smooth scrolling to scroll to the trending section
    const top = document.getElementById("top")
    if (top) {
      top.scrollIntoView({
        block: "start",
        behavior: "smooth",
      })
    }
  }

  const handleProductsClick = () => {
    // Use smooth scrolling to scroll to the trending section
    const products = document.getElementById("products")

    if (products) {
      products.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
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
    <nav className="bg-white shadow-2xl   fixed top-0  mb-1  p-2 md:sticky md:top-0 ">
      <div className="flex items-center justify-center ">
        <div className="flex items-center justify-center space-x-4  mt-0 ">
          <Link to="/profile">
            <FontAwesomeIcon
              icon={faUser}
              className="text-pink-800 text-lg ml-5 "
            />
          </Link>
          {/* Cart Icon */}
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-pink-800 text-lg m-5 cursor-pointer"
            onClick={handleCartIconClick}
          />
          <Link to="/">
            <img
              src="https://codeswear.com/logo.png"
              className="h-[50px] w-[200px] mx-5"
            />
          </Link>
          {/* User Icon */}
          <input
            type="text"
            className=" focus:border-pink-500 cursor-pointer rounded-2xl p-3 pl-4 pr-12 w-[400px] shadow-md border text-pink-800 placeholder-pink-600 focus:outline-none text-lg"
            placeholder="Search products"
            value={searchValue}
            onChange={handleSearchInputChange}
            list="suggestionsList"
          />
          <button
            className="bg-pink-500 text-white shadow-md rounded-md px-4 py-2 font-semibold hover:bg-pink-700 transition duration-300"
            onClick={handleSearch}
          >
            <img
              src="https://www.svgrepo.com/show/513607/search.svg"
              alt=""
              className="h-6 w-6"
            />
          </button>
          <ul className="z-10 bg-white   mt-2 mr-30 relative top-[58px]  right-[490px] w-[400px]">
            {searchSuggestions &&
              searchSuggestions.length > 0 &&
              searchSuggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  className="cursor-pointer p-2 hover:bg-pink-50 transition duration-500    "
                  onClick={() => handleSuggestionClick(suggestion._id)}
                >
                  <img
                    src={`http://localhost:3900/${suggestion.forms[0].image_filename}`}
                    alt=""
                    className="h-[50px] w-[100px] object-cover inline mr-5"
                  />
                  <p className="inline font-semibold ">{suggestion.title}</p>
                </li>
              ))}
          </ul>
        </div>
        <div className="flex justify-center items-center space-x-7">
          {user ? null : (
            <>
              <Link to="/login">
                <h3 className="text-center text-pink-900 text-lg  font-bold">
                  Login
                </h3>
              </Link>
              <Link to="/signup">
                <h3 className="text-center text-pink-900 text-lg  font-bold">
                  Sign Up
                </h3>
              </Link>
            </>
          )}
          <button
            className=" text-pink-500 text-lg font-bold hover:text-pink-900  transition duration-300"
            onClick={handleTrendingClick}
          >
            Trending
          </button>
          <button
            className=" text-pink-500 text-lg font-bold  flex flex-row  hover:text-pink-900 transition duration-300"
            onClick={handleTopClick}
          >
            Top
          </button>
          <button
            className=" text-pink-500 text-lg font-bold   hover:text-pink-900 transition duration-300"
            onClick={handleProductsClick}
          >
            Latest
          </button>
          {user?.isAdmin === true ? (
            <Link to="/add">
              <button
                className=" text-pink-500 text-lg font-bold    hover:text-pink-900 transition duration-300"
                onClick={handleProductsClick}
              >
                Add
              </button>
            </Link>
          ) : null}
          {user?.isAdmin === true ? (
            <Link to="/Orders">
              <button
                className=" text-pink-500 text-lg font-bold  hover:text-pink-900 transition duration-300"
                onClick={handleProductsClick}
              >
                Orders
              </button>
            </Link>
          ) : null}
        </div>
      </div>
      {cart ? (
        <Cart
          cart={cart}
          isSidebarOpen={isSidebarOpen}
          faTimes={faTimes}
          FontAwesomeIcon={FontAwesomeIcon}
          handleSidebarClose={handleSidebarClose}
          handleCheckout={handleCheckout}
          isLoadingSidebar={isLoadingSidebar}
        />
      ) : null}
    </nav>
  )
}

export default NavBar
