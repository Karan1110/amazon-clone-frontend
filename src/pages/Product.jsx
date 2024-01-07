import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import useProductStore from "../store/index"
import ProductCard from "./ProductCard"
import { StarRating } from "./ProductCard"
import axios from "axios"

const Product = () => {
  const recommendedProducts = useProductStore((state) => state.top_products)
  const product = useProductStore((state) => state.product)
  const addRating = useProductStore((state) => state.addRating)
  const addToCart = useProductStore((state) => state.addToCart)
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
  const [quantity, setQuantity] = useState(1)
  const [avgRating, setAvgRating] = useState(5)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [review, setReview] = useState("")
  // Function to handle image click and open the modal
  const handleImageClick = (imageURL) => {
    setIsModalOpen(true)
  }

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productData = await fetchProduct(title)
        if (productData && productData.forms && productData.forms[0]) {
          const totalRatings = productData.ratings.length
          setAvgRating(
            totalRatings > 0
              ? productData.ratings.reduce(
                  (sum, rating) => sum + rating.rating,
                  0
                ) / totalRatings
              : 0
          )
          setSelectedImage(
            `http://localhost:3900/${productData.forms[0].image_filename}`
          )
        }
      } catch (error) {
        console.error("Error fetching product data:", error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [fetchProduct, title]) // Include fetchProduct and title in the dependency array

  // Check if the product data is still loading or not available
  if (
    isLoading ||
    !product ||
    !product.forms || // Add a check for product.forms
    (product.forms && !product.forms[0]) ||
    product.forms[0]?.image_filename === null ||
    product.forms[0]?.image_filename === undefined
  ) {
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
        quantity: quantity,
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
  const handleSvgClick = () => {
    setError(null)
  }

  const handleRatingLike = async (id, index) => {
    try {
      await axios.post(
        `http://localhost:3900/api/products/${product._id}/rating/like/${id}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )

      product.ratings[index].likes++
    } catch (ex) {
      setError(ex.message)
      console.log(ex)
    }
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
      await addRating(product._id, userRating, review)
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
          data-testid="modal"
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
        <>
          <div className="p-0 overflow-hidden flex flex-start  mb-3">
            <div className="flex flex-col">
              {product.forms &&
                product.forms.map((form, index) => (
                  <>
                    <button
                      key={form.id} // Make sure to add the "key" prop when using a dynamic list
                      onClick={() => {
                        handleAttributeChange(form.image_filename)
                        setSelectedForm(index)
                      }}
                      className={`py-1 px-1 z-0 font-bold text-white  transition duration-300 relative bottom-0 mb-30 m-3 p-1 
                  ${index === selectedForm ? "border border-pink-500" : ""}`}
                      style={{
                        width: "80px",
                        height: "100px",
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
                className="h-96 w-full object-cover m-6 "
                style={{ height: "40vw", width: "35vw" }}
                onClick={handleImageClick}
              />
              <div className="p-4 flex  flex-col ">
                <div className="mb-3">
                  {error && (
                    <div
                      className="bg-red-100 border m-5 ml-0 border-red-400 text-red-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <span className="block sm:inline">{error}</span>
                      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg
                          className="fill-current h-6 w-6 text-red-500"
                          onClick={handleSvgClick}
                          role="button"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <title>Close</title>
                          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                      </span>
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-pink-800">
                    {product.title}
                  </h1>
                  <p
                    className="text-pink-600 py-5 px-2 max-w-xl "
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <div className="border p-2 my-3 ml-2 px-2 py-2 w-64">
                    <p className=" font-bold text-lg    text-pink-700   border-b m-1">
                      Price : ₹{product.price}
                    </p>
                    <p className=" font-bold py-2    text-pink-700  text-lg border-b  m-1">
                      {" "}
                      Brand : {product.brand}
                    </p>
                    <p className=" font-bold py-2    text-pink-700  text-lg border-b  m-1">
                      {" "}
                      Stock: {product.numberInStock}
                    </p>
                    <p className=" font-bold text-lg    text-pink-700   m-1">
                      Category : {product.category}
                    </p>
                  </div>
                  <p className=" font-bold text-lg    text-pink-700   ml-2 ">
                    Available colors :{" "}
                  </p>

                  <div className="flex  ml-2 flex-row space-x-1">
                    {" "}
                    {product.color.map((color) => (
                      <div
                        style={{ backgroundColor: color }}
                        className={` w-7 h-7 rounded-full `}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-6 space-x-4">
                    {typeof product.size !== "object"
                      ? product.size &&
                        JSON.parse(product.size).map((size, index) => (
                          <button
                            key={size}
                            className={`px-4 py-2 m-2  font-bold border-2 border-white text-gray  shadow-md   rounded-md hover:bg-pink-800 transition duration-300  ${
                              index === selectedSize ? "bg-pink-500" : ""
                            }`}
                            onClick={() => {
                              setSelectedSize(index)
                            }}
                          >
                            {size}
                          </button>
                        ))
                      : product.size &&
                        product.size.map((size, index) => (
                          <button
                            key={size}
                            className={`px-4 py-2   font-bold border-2 border-pink-800 text-gray  shadow-2xl m-2 rounded-md hover:bg-pink-800 transition duration-300  ${
                              index === selectedSize ? "bg-pink-500" : ""
                            }`}
                            onClick={() => {
                              setSelectedSize(index)
                            }}
                          >
                            {size}
                          </button>
                        ))}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleOrderClick}
                    type="button"
                    class="text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Buy now
                  </button>
                  <button
                    onClick={handleCartClick}
                    type="button"
                    class="text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      class="w-3.5 h-3.5 me-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 21"
                    >
                      <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                    Add to Cart
                  </button>
                  <div className="inline-flex m-2 border h-[40px] rounded-md">
                    <button
                      type="button"
                      id="decrement-button"
                      data-input-counter-decrement="quantity-input"
                      className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                      onClick={() => setQuantity((prev) => prev - 1)}
                    >
                      <svg
                        className="w-3 h-3 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 2"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 1h16"
                        />
                      </svg>
                    </button>

                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      id="quantity-input"
                      data-input-counter
                      aria-describedby="helper-text-explanation"
                      className="bg-gray-50 border-x-0 w-10 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="1"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      id="increment-button"
                      data-input-counter-increment="quantity-input"
                      className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    >
                      <svg
                        className="w-3 h-3 text-gray-900 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 1v16M1 9h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="block m-5 ml-0">
                    <StarRating averageRating={avgRating} />
                  </div>
                  <button
                    onClick={() => {
                      const currentUser = localStorage.getItem("user")
                        ? JSON.parse(localStorage.getItem("user"))
                        : null

                      const hasUserRated =
                        product.ratings &&
                        product.ratings.some(
                          (rating) => rating.user.name === currentUser?.name
                        )

                      // Now you can use hasUserRated in your logic
                      if (hasUserRated) {
                        setError("You have already rated this product...")
                        return
                      }
                      setIsOpen(!isOpen)
                    }}
                    className="block text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Add Rating
                  </button>

                  {isOpen && (
                    <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center z-50">
                      <div className="bg-white p-8 rounded-md shadow-md w-[700px] h-[500px]">
                        <div className=" p-2 rounded-2xl flex items-center justify-center text-center mb-4">
                          <div className="flex  flex-col items-center justify-center  space-x-5 space-y-5">
                            <label
                              for="number-input"
                              className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
                            >
                              Your Rating
                            </label>
                            <input
                              type="number"
                              id="number-input"
                              aria-describedby="helper-text-explanation"
                              className=" w-[450px] bg-gray-50 focus:ring-blue-500  border-2  text-gray-900 text-sm rounded-lg  focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:border-blue-500"
                              placeholder="upto 5..."
                              required
                              value={userRating}
                              onChange={(e) => setUserRating(e.target.value)}
                            />

                            <label
                              for="message"
                              className="block mb-2 text-lg  font-medium text-gray-900 dark:text-white"
                            >
                              Your Review
                            </label>
                            <textarea
                              id="message"
                              rows="4"
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Write your thoughts here..."
                              onChnage={(e) => setReview(e.target.value)}
                              value={review}
                            ></textarea>

                            <button
                              className="bg-pink-600 text-white rounded-2xl px-4 py-2 hover:bg-pink-800 transition duration-300"
                              onClick={async () => await handleAddRating()}
                            >
                              Add Rating
                            </button>
                          </div>
                        </div>

                        {/* Add a close button if needed */}
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-gray-500 hover:text-gray-700 ml-2"
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/106/106830.png"
                            alt=""
                            className="h-6 w-6 "
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-3  border-b text-pink-600 text-left mt-4">
                    {" "}
                    Ratings{" "}
                  </h3>
                  <div className="grid grid-cols-2 space-x-3 space-y-3  ">
                    {product.ratings &&
                      product.ratings.map((rating, index) => (
                        <article
                          className={`p-1 ${
                            !showAll && index > 1 ? "none" : ""
                          }`}
                        >
                          <div class="flex items-center mb-1">
                            <img
                              class="w-10 h-10 me-4 rounded-full"
                              src="https://cdn-icons-png.flaticon.com/512/666/666201.png"
                              alt=""
                            />
                            <div class="font-medium dark:text-white">
                              <p>Jese Leos</p>
                            </div>
                          </div>
                          <div class="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                            <StarRating averageRating={rating.rating} />
                            <h3 class="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                              Reviewed form {rating.user.address.city}
                            </h3>
                          </div>
                          <p class="mb-2 text-gray-500 dark:text-gray-400">
                            {rating.review ??
                              "This is my third Invicta Pro Diver. They are just fantastic value for money. This one arrived yesterday and the first thing I did was set the time, popped on an identical strap from another Invicta and went in the shower with it to test the waterproofing.... No problems."}
                          </p>
                          <aside>
                            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {rating.likes} people found this helpful
                            </p>
                            <div class="flex items-center mt-3">
                              <button
                                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                onClick={() =>
                                  handleRatingLike(rating._id, index)
                                }
                              >
                                Helpful
                              </button>
                            </div>
                          </aside>
                        </article>
                      ))}
                  </div>
                  {product.ratings && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-blue-600 block relative bottom-0 right-0 hover:underline dark:text-blue-500"
                    >
                      {showAll ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-pink-500 my-4 shadow-lg"></div>
          <h2 className="text-pink-900 text-2xl m-3 font-bold">
            Recommended Products
          </h2>
          <div className="flex flex-wrap justify-start">
            {recommendedProducts &&
              recommendedProducts.map((product) => (
                <ProductCard product={product} addToCart={addToCart} />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Product
