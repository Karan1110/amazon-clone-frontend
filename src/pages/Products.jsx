import React from "react"
import { Link, useNavigate } from "react-router-dom"
import useStore from "../store/index"
import addNotification from "react-push-notification"
import { useState, useEffect } from "react"
const Products = () => {
  const [page, setPage] = useState(0)
  const [products, setProducts] = useState(null)
  const trending_products = useStore((state) => state.trending_products)
  const top_products = useStore((state) => state.top_products)
  const addToCart = useStore((state) => state.addToCart)
  console.log(products)
  const history = useNavigate()
  function send() {
    try {
      addNotification({
        title: "Welcome",
        subtitle: "From KaranStore",
        message: "browse exclusive products from KaranStore!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      })
    } catch (ex) {
      console.error(ex)
    }
  }
  send()

  async function sendCartFetchRequest(productId, authToken) {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }

    try {
      // Add 'await' here to wait for the addToCart function to complete
      await addToCart(productId, authToken)
    } catch (error) {
      // Handle any other errors that may occur during the fetch
      console.error("Error occurred while fetching data:", error.message)
      throw error
    }
  }

  useEffect(() => {
    async function getProducts() {
      const products_response = await fetch(
        `http://localhost:3900/api/products?page=${page}`
      )
      const products = await products_response.json()
      if (products.length > 0) {
        setProducts(products)
      }
      console.log(page)
    }
    if (page > -1) {
      getProducts()
    }
  }, [page])
  function handlePageClick(num) {
    setPage(num)
  }
  return (
    <>
      <h2 className="text-pink-900 text-2xl m-5  font-bold" id="products">
        Our Products
      </h2>
      <div className="flex items-center ">
        {products ? (
          products.map((product) => (
            <div
              className="border border-pink-500 mb-4 rounded-2xl  mr-4 ml-4 mt-4 shadow-xl min-h-xl"
              style={{ width: "20vw", height: "32.5vw" }}
            >
              <img
                src={`http://localhost:3900/${product.forms[0].image_filename}`}
                className="h-100 w-full object-cover rounded-t-2xl "
                style={{ height: "15vw", width: "20vw" }}
              />
              <div className="p-4">
                <h3 className="text-pink-800 text-xl font-semibold mb-2">
                  {product.title}
                </h3>{" "}
                <p
                  className="text-pink-600"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                <p className="text-gray-400 font-semibold text-lg">
                  ${product.price}
                </p>
                <p className="text-pink-800 font-bold text-sm">
                  Brand : {product.brand}
                </p>
                <p className="text-pink-800 font-bold text-sm">
                  category : {product.category}
                </p>
                <Link to={`/product/${product._id}`}>
                  <button className="bg-pink-500 text-white font-semibold  rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                    View More
                  </button>
                </Link>
                <button
                  className="bg-pink-500 text-white font-semibold rounded-2xl m-2 px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                  id="my_button"
                  onClick={() => {
                    sendCartFetchRequest(
                      product._id,
                      localStorage.getItem("token")
                    )
                    send()
                  }}
                >
                  add to cart.
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-cl font-bold text-pink-500">
            {" "}
            No products found in page no {page}{" "}
          </div>
        )}
      </div>
      <div class="inline-flex m-7">
        <button
          class={`bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-bold py-4 border-r px-6 rounded-l ${
            page === 0 ? "cursor-not-allowed bg-gray-500" : ""
          }`}
          onClick={() => handlePageClick(page - 1)}
          disabled={page === 0}
        >
          Prev
        </button>
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg  border-l font-bold py-4 px-6 rounded-r"
          onClick={() => handlePageClick(page + 1)}
        >
          Next
        </button>
      </div>

      <h2 className="text-pink-900 text-2xl m-5 font-bold  " id="trending">
        Trending Products
      </h2>
      <div className="flex items-center ">
        {trending_products
          ? trending_products.map((product) => (
              <div
                className="border border-pink-500 mb-4 rounded-2xl  mr-4 ml-4 mt-4 shadow-xl min-h-xl"
                style={{ width: "20vw", height: "32.5vw" }}
              >
                <img
                  src={`http://localhost:3900/${product.forms[0].image_filename}`}
                  className="h-100 w-full object-cover rounded-t-2xl"
                  style={{ height: "15vw", width: "20vw" }}
                />
                <div className="p-4">
                  <h3 className="text-pink-800 text-xl font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p
                    className="text-pink-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <p className="text-gray-400 font-semibold text-lg">
                    ${product.price}
                  </p>
                  <p className="text-pink-800 font-bold text-sm">
                    Brand : {product.brand}
                  </p>
                  <p className="text-pink-800 font-bold text-sm">
                    category : {product.category}
                  </p>
                  <Link to={`/product/${product._id}`}>
                    <button className="bg-pink-500 text-white font-semibold rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                      View More
                    </button>
                  </Link>
                  <button
                    className="bg-pink-500 text-white font-semibold  rounded-2xl m-2 px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                    onClick={() => {
                      sendCartFetchRequest(
                        product._id,
                        localStorage.getItem("token")
                      )
                      send()
                    }}
                  >
                    add to cart.
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
      <h2 className="text-pink-900 text-2xl m-5  font-bold" id="top">
        Best Selling
      </h2>
      <div className="flex items-center ">
        {top_products
          ? top_products.map((product) => (
              <div
                className="border border-pink-500 mb-4 rounded-2xl  mr-4 ml-4 mt-4 shadow-xl min-h-xl"
                style={{ width: "20vw", height: "32.5vw" }}
              >
                <img
                  src={`http://localhost:3900/${product.forms[0].image_filename}`}
                  className="h-100 w-full object-cover rounded-t-2xl "
                  style={{ height: "15vw", width: "20vw" }}
                />
                <div className="p-4">
                  <h3 className="text-pink-800 text-xl font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p
                    className="text-pink-600"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                  <p className="text-gray-400 font-semibold text-lg">
                    ${product.price}
                  </p>
                  <p className="text-pink-800 font-bold text-sm">
                    Brand : {product.brand}
                  </p>
                  <p className="text-pink-800 font-bold text-sm">
                    category : {product.category}
                  </p>
                  <Link to={`/product/${product._id}`}>
                    <button className="bg-pink-500 text-white font-semibold rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                      View More
                    </button>
                  </Link>
                  <button
                    className="bg-pink-500 font-semibold text-white rounded-2xl m-2 px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                    onClick={() => {
                      sendCartFetchRequest(
                        product._id,
                        localStorage.getItem("token")
                      )

                      send()
                    }}
                  >
                    add to cart.
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
    </>
  )
}

export default Products
