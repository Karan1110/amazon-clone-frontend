import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3900/api/analytics/orders",
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
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
          <div className="max-w-2xl m-7" key={order._id}>
            <div className="bg-white shadow-lg rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
              <Link to={`/product/${order.product?._id}`}>
                <img
                  className="px-2 h-[350px] w-[280px]"
                  src={`http://localhost:3900/${order.product?.forms[0]?.image_filename}`}
                  alt={`Order ${order._id}`}
                />
              </Link>
              <div className="px-3 pb-3">
                <h3 className="text-gray-900 font-semibold text-xl mt-1 tracking-tight dark:text-white">
                  {order.product?.title}
                </h3>
                <p
                  className="text-pink-600"
                  dangerouslySetInnerHTML={{
                    __html: order.product?.description,
                  }}
                />
                <p className="text-gray-400 font-semibold text-lg">
                  ${order.product?.price}
                </p>
                <p className="text-pink-800 font-bold text-sm">
                  Brand: {order.product?.brand}
                </p>
                <p className="text-pink-800 font-bold text-sm">
                  Category: {order.product?.category}
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
                <Link to={`/product/${order.product?._id}`}>
                  <button className="bg-pink-500 text-white font-semibold rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                    View More
                  </button>
                </Link>
              </div>
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
