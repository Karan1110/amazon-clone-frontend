import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useProductStore from "../store/index"

const Product = () => {
  const product = useProductStore((state) => state.product)
  const addRating = useProductStore((state) => state.addRating)
  const fetchProduct = useProductStore((state) => state.fetchProduct)
  const [showRatings, setShowRatings] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const { title } = useParams()
  const [selectedSize, setSelectedSize] = useState(0)
  const [selectedForm, setSelectedForm] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const history = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Function to handle image click and open the modal
  const handleImageClick = (imageURL) => {
    setIsModalOpen(true)
  }
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        await fetchProduct(title)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching product data:", error.message)
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [title, fetchProduct])

  // Check if the product data is still loading or not available
  if (isLoading || !product.forms[0].image_filename) {
    return (
      // Skeleton Loading UI or other loading state
      // You can customize this part as needed
      <div className="p-4 flex items-center justify-center text-center ">
        <div
          className="border-t-4 border-pink-600 rounded-full animate-spin"
          style={{ height: "10vw", width: "10vw" }}
        ></div>
      </div>
    )
  }

  const handleAttributeChange = (image) => {
    setSelectedImage(`http://localhost:3900/${image}`)
  }

  const handleOrderClick = () => {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }
    history(`/order/${product._id}/${selectedSize}/${selectedForm}`)
  }
  async function sendCartFetchRequest(productId, authToken) {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }
    const url = "http://localhost:3900/api/cart"

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken,
      },
      body: JSON.stringify({
        product_id: productId,
        form: selectedForm,
        size: selectedSize,
      }),
    }

    try {
      const response = await fetch(url, requestOptions)
      if (!response.ok) {
        // Handle the error response if needed
        const errorData = await response.json()
        throw new Error(errorData.message)
      }

      // If successful, return the response data (if any)
      const responseData = await response.json()
      return responseData
    } catch (error) {
      // Handle any other errors that may occur during the fetch
      console.error("Error occurred while fetching data:", error.message)
      throw error
    }
  }

  const handleCartClick = async () => {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }
    // Get existing cart data from the local storage, if any
    const existingCartDataString = localStorage.getItem("cart")
    let existingCartData = []

    if (existingCartDataString) {
      // Parse the existing JSON string to an array
      existingCartData = JSON.parse(existingCartDataString)
    }

    // Create a new cart item object
    const newCartItem = {
      ...product,
      form: selectedForm,
      size: selectedSize,
    }

    // Merge the existing cart data with the new cart item
    const mergedCartData = [...existingCartData, newCartItem]

    // Convert the mergedCartData array to a JSON string
    const cartDataString = JSON.stringify(mergedCartData)
    await sendCartFetchRequest(product._id, localStorage.getItem("token"))
    // Set the cartDataString in the local storage with the key "cart"
    localStorage.setItem("cart", cartDataString)
  }

  const handleAddRating = async () => {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }
    console.log(localStorage.getItem("user"))
    if (userRating > 0 && userRating <= 5) {
      // Create a new rating object and add it to the existing ratings list
      const user = localStorage.getItem("user")
      const newRating = {
        rating: userRating,
        user: user.name || "Anonymous",
      }
      console.log(product._id, userRating)
      await addRating(product._id, userRating)
      product.ratings.push(newRating)
      setShowRatings(true) // Show the ratings section after adding a new rating
      setUserRating(0) // Reset the input field
    }
  }

  return (
    <div>
      {isModalOpen && (
        <div
          className="fixed  top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-50 flex justify-center items-center "
          onClick={() => setIsModalOpen(false)} // Close the modal on click outside the image
        >
          <div className="w-3/4 max-h-3/4 max-w-3/4 bg-white rounded-lg relative ">
            <img
              src={selectedImage}
              alt="Enlarged"
              className="w-full  h-screen max-h-screen"
            />
            <button
              className="absolute mt-6 mr-3 top-0 right-0 bg-pink-500 text-white rounded-full px-3 py-2 hover:bg-pink-600 transition duration-300"
              onClick={() => setIsModalOpen(false)} // Close the modal on button click
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isLoading ? (
        // Skeleton Loading UI
        <div className="p-4 overflow-hidden min-w-screen">
          <div className="w-5 h-5 border-t-4 border-pink-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        // Actual Product Details

        <div className="p-0 overflow-hidden flex flex-start shadow-2xl mb-3">
          <div className="flex flex-col">
            {product.forms.map((form, index) => (
              <>
                <button
                  key={form.id} // Make sure to add the "key" prop when using a dynamic list
                  onClick={() => {
                    handleAttributeChange(form.image_filename)
                    setSelectedForm(index)
                  }}
                  className={`py-2 px-4 bg-pink-600 text-white hover:bg-pink-700 transition duration-300 relative bottom-0 mb-30 m-3 p-1 rounded-lg
                  ${index == selectedForm ? "border-2 border-pink-500" : ""}`}
                  style={{
                    width: "7vw",
                    height: "5vw",
                    backgroundImage: `url(http://localhost:3900/${form.image_filename})`,
                    backgroundSize: "cover",
                  }}
                ></button>
                <div className="text-center text-pink-900 font-semibold">
                  {form.name}
                </div>
              </>
            ))}
          </div>

          <div
            className="max-w-12xl bg-white  h-full w-full overflow-hidden flex flex-start"
            // style={{ width: "99vw" }}
          >
            <img
              src={
                selectedImage !== null
                  ? selectedImage
                  : `http://localhost:3900/${product.forms[0].image_filename}`
              }
              alt="Product"
              className="h-96 w-full object-cover m-6 shadow-2xl"
              style={{ height: "40vw", width: "35vw" }}
              onClick={handleImageClick}
            />
            <div className="p-4 flex  flex-col ">
              <div className="mb-3">
                <h1 className="text-3xl font-bold text-pink-800">
                  {product.title}
                </h1>

                <p className="text-pink-600 font-bold mt-1">Description</p>
                {/* <br /> */}
                <p className="text-pink-600 font-semibold ">
                  {product.description}
                </p>
                <p className="text-gray-400 font-semibold text-2xl m-2">
                  Price : ${product.price}
                </p>
                <p className="text-gray-500 font-bold text-2xl m-2">
                  Brand : {product.brand}
                </p>
                <p className="text-gray-500 font-bold text-2xl m-2">
                  Category : {product.category}
                </p>
                <div className="mt-6 space-x-4">
                  {product.size.map((size, index) => (
                    <button
                      key={size}
                      className={`px-4 py-2   border-2 border-pink-500 text-gray font-semibold shadow-2xl m-2 rounded-md hover:bg-pink-700 transition duration-300  ${
                        index == selectedSize ? "bg-pink-700" : ""
                      }`}
                      onClick={() => setSelectedSize(index)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="w-full py-3 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 transition duration-300"
                  onClick={handleOrderClick}
                >
                  Order Now
                </button>
                <button
                  className="w-full py-3 mt-3 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 transition duration-300"
                  onClick={() => handleCartClick()}
                >
                  Add to Cart
                </button>
                <h3 className="font-bold text-xl text-pink-600 text-center m-2">
                  {" "}
                  Ratings{" "}
                </h3>
                <div className="grid grid-cols-3">
                  {/* Existing ratings */}
                  {product.ratings.map((rating, index) => (
                    <div
                      key={index}
                      className="bg-pink-100  p-4 m-4 rounded-2xl "
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {rating.rating}
                        </div>
                        <p className="text-pink-800 font-bold">
                          {rating.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Add a new rating */}
                  <div className="bg-pink-100 p-2 mt-4 rounded-2xl flex items-center justify-center text-center">
                    <div className="flex items-center space-x-5">
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={userRating}
                        onChange={(e) =>
                          setUserRating(parseInt(e.target.value))
                        }
                        className="w-16 text-center  h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      />
                      <button
                        className="bg-pink-600 text-white rounded-2xl px-4 py-2 hover:bg-pink-700 transition duration-300"
                        onClick={async () => await handleAddRating()}
                      >
                        Add Rating
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
