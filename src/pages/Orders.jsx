import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3900/api/analytics/orders"
        )
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const ordersData = await response.json()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching orders:", error.message)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="flex flex-wrap justify-center min-h-[67vh] ">
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-pink-500 mb-4 rounded-2xl mr-4 ml-4 mt-4 shadow-xl min-h-xl"
            style={{ width: "20vw", height: "32.5vw" }}
          >
            <img
              src={`http://localhost:3900/${order.product.forms[0].image_filename}`}
              className="h-100 w-full object-cover rounded-t-2xl "
              style={{ height: "15vw", width: "20vw" }}
              alt={`Order ${order._id}`}
            />
            <div className="p-4">
              <h3 className="text-pink-800 text-xl font-semibold mb-2">
                {order.product.title}
              </h3>
              <p
                className="text-pink-600"
                dangerouslySetInnerHTML={{ __html: order.product.description }}
              />
              <p className="text-gray-400 font-semibold text-lg">
                ${order.product.price}
              </p>
              <p className="text-pink-800 font-bold text-sm">
                Brand: {order.product.brand}
              </p>
              <p className="text-pink-800 font-bold text-sm">
                Category: {order.product.category}
              </p>
              <p className="text-pink-800 font-bold text-sm">
                Quantity: {order.quantity}
              </p>
              <p className="text-pink-800 font-bold text-sm">
                Size: {order.size}
              </p>
              <p className="text-pink-800 font-bold text-sm">
                Status: {order.status}
              </p>
              <Link to={`/product/${order.product._id}`}>
                <button className="bg-pink-500 text-white font-semibold rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                  View More
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="font-bold text-pink-500 text-xl flex items-center justify-center ">
          NO ORDERS CURRENTLY
        </div>
      )}
    </div>
  )
}

export default Orders
