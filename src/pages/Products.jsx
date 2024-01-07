import React from "react"
import { Link, useNavigate } from "react-router-dom"
import useStore from "../store/index"
import addNotification from "react-push-notification"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard.jsx"
const Products = () => {
  const [page, setPage] = useState(0)
  const [products, setProducts] = useState(null)
  const trending_products = useStore((state) => state.trending_products)
  const top_products = useStore((state) => state.top_products)
  const addToCart = useStore((state) => state.addToCart)

  console.log(products)
  const history = useNavigate()
  function send(title) {
    try {
      addNotification({
        title: `${title} added to your cart!`,
        subtitle: "From KaranStore",
        message: "browse exclusive products from KaranStore!",
        theme: "darkblue",
        native: true, // when using native, your OS will handle theming.
      })
    } catch (ex) {
      console.error(ex)
    }
  }

  async function sendCartFetchRequest(productId, title) {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } })
    }

    try {
      // Add 'await' here to wait for the addToCart function to complete
      await addToCart(productId)
      send(title)
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
      <h2 className="text-pink-900 text-2xl m-3 mt-1  font-bold" id="products">
        Latest
      </h2>
      <div className="flex items-center ">
        {products ? (
          products.map((product) => (
            <>
              <ProductCard product={product} addToCart={sendCartFetchRequest} />
            </>
          ))
        ) : (
          <div className="text-center text-cl font-bold text-pink-500">
            {" "}
            No products found in page no {page}{" "}
          </div>
        )}
      </div>
      <div className="inline-flex m-7 text-center items-center justify-center ">
        <button
          className={` rounded-r-none shadow-2xl rounded-full text-center   hover:bg-gray-100   text-gray-800 text-lg font-bold py-4  px-6 rounded-full ${
            page === 0 ? "cursor-not-allowed " : ""
          }`}
          onClick={() => handlePageClick(page - 1)}
          disabled={page === 0}
        >
          Prev
        </button>
        <button
          className=" rounded-l-none rounded-full shadow-2xl border-l  text-center  hover:bg-gray-100   border-gray-300 text-gray-800 text-lg   font-bold py-4 px-6 rounded-full-r"
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
              <>
                <ProductCard
                  product={product}
                  addToCart={sendCartFetchRequest}
                />
              </>
            ))
          : null}
      </div>
      <h2 className="text-pink-900 text-2xl m-5  font-bold" id="top">
        Best Selling
      </h2>
      <div className="flex items-center ">
        {top_products
          ? top_products.map((product) => (
              <>
                <ProductCard
                  product={product}
                  addToCart={sendCartFetchRequest}
                />
              </>
            ))
          : null}
      </div>
    </>
  )
}

export default Products
