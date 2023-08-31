import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useStore from "../store/index"

const Order = () => {
  const product = useStore((state) => state.product)
  const fetchProduct = useStore((state) => state.fetchProduct)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const { id, size, form } = useParams()
  const history = useNavigate()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProduct(id)
  }, [fetchProduct, id])

  useEffect(() => {
    setTimeout(() => {
      if (product.forms) {
        setIsLoading(false)
      }
    }, 500)
  }, [product.forms])

  const handleConfirmOrder = () => {
    const apiUrl = "http://localhost:3900/api/orders"
    const product_id = product._id
    const token = localStorage.getItem("token") // Replace with your actual authentication token

    const postData = {
      product_id: product_id,
      quantity: quantity,
      payment_method: paymentMethod,
      form: form,
      size: size,
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(postData),
    }

    // Make the fetch request
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (paymentMethod == "card") {
          fetch(`http://localhost:3900/api/checkout/${data._id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data)
              window.location = data.url
            })
        } else {
          history("/success")
        }
      })
      .catch((error) => {
        history("/failed")
        console.error("Error:", error.message, error)
      })

    setIsModalOpen(false) // Close the modal after confirming the order
  }

  console.log(product)
  return (
    <div className="p-4 overflow-hidden flex justify-center items-center">
      {/* Order Details Modal */}
      {
        <div className="flex-shrink-0 m-5">
          <div
            className="modal-content bg-white border rounded-2xl shadow-lg p-5 transform transition-all duration-300"
            style={{
              height: "400px",
              width: "40vw",
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block font-bold text-pink-900"
              >
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                className="w-full p-2 border border-pink-700 rounded focus:outline-none focus:border-pink-900 transition-all duration-300"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <label
                htmlFor="payment_method"
                className="block font-bold text-pink-900 mt-3"
              >
                Payment Method:
              </label>

              <input
                type="text"
                id="paymentMethod"
                placeholder="We currently accept only card and cash-on-delivery payment method."
                className="w-full p-2 border border-pink-700 rounded mt-3 mb-3 focus:outline-none focus:border-pink-900 transition-all duration-300"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                className="bg-pink-700 text-white px-4 py-2 rounded-2xl hover:bg-pink-800 transition duration-300"
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      }

      {isLoading ? (
        <div className="p-4 flex items-center justify-center text-center ">
          <div
            className="border-t-4 border-pink-600 rounded-full animate-spin"
            style={{ height: "10vw", width: "10vw" }}
          ></div>
        </div>
      ) : (
        <div className="flex-shrink-0 m-5 p-5">
          <div
            className="modal-content bg-white border rounded-2xl shadow-lg p-5 transform transition-all duration-300"
            style={{
              height: "600px",
              width: "24vw",
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Product : </h2>
            <div className="border border-pink-500 mb-4 rounded-2xl py-4 mr-4 ml-4 mt-4 shadow-xl">
              <img
                src={`http://localhost:3900/${product.forms[0].image_filename}`}
                className="h-100 w-full object-cover rounded-2xl"
              />

              <div className="p-4">
                <h3 className="text-pink-800 text-xl font-semibold mb-2">
                  {product.title}
                </h3>
                <p className="text-pink-600 mb-4">{product.description}</p>
                <Link to={`/product/${product._id}`}>
                  <button className="bg-pink-500 text-white rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                    View More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Order
