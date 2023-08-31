import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/index";

const Products = () => {
  const products = useStore((state) => state.products);
  const trending_products = useStore((state) => state.trending_products);
  const top_products = useStore((state) => state.top_products);
  console.log(products);
  const history = useNavigate();

  async function sendCartFetchRequest(productId, authToken) {
    if (!localStorage.getItem("token")) {
      history("/signup", { state: { from: window.location.pathname } });
    }

    const url = "http://localhost:3900/api/cart";

    const requestOptions = {
      method: "POST", // Adjust the method as needed (GET, POST, PUT, DELETE, etc.)
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": authToken,
      },
      body: JSON.stringify({ product_id: productId }),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        // Handle the error response if needed
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // If successful, return the response data (if any)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      // Handle any other errors that may occur during the fetch
      console.error("Error occurred while fetching data:", error.message);
      throw error;
    }
  }

  return (
    <>
      <h2 className="text-pink-900 text-2xl m-5  font-bold" id="products">
        Our Products
      </h2>
      <div className="flex items-center ">
        {products
          ? products.map((product) => (
              <div
                className="border border-pink-500 mb-4 rounded-2xl py-4 mr-4 ml-4 mt-4 shadow-xl min-h-xl"
                style={{ width: "20vw", height: "30vw" }}
              >
                <img
                  src={`http://localhost:3900/${product.forms[0].image_filename}`}
                  className="h-100 w-full object-cover rounded-2xl"
                  style={{ height: "15vw", width: "20vw" }}
                />
                <div className="p-4">
                  <h3 className="text-pink-800 text-xl font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-pink-600 ">{product.description}</p>
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
                    <button className="bg-pink-500 text-white rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                      View More
                    </button>
                  </Link>
                  <button
                    className="bg-pink-500 text-white rounded-2xl m-2 px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                    onClick={() => {
                      sendCartFetchRequest(
                        product._id,
                        localStorage.getItem("token")
                      );
                    }}
                  >
                    add to cart.
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
      <h2 className="text-pink-900 text-2xl m-5 font-bold  " id="trending">
        Trending Products
      </h2>
      <div className="flex items-center ">
        {trending_products
          ? trending_products.map((product) => (
              <div
                className="border border-pink-500 mb-4 rounded-2xl py-4 mr-4 ml-4 mt-4 shadow-xl min-h-xl"
                style={{ width: "20vw", height: "30vw" }}
              >
                <img
                  src={`http://localhost:3900/${product.forms[0].image_filename}`}
                  className="h-100 w-full object-cover rounded-2xl"
                  style={{ height: "15vw", width: "20vw" }}
                />
                <div className="p-4">
                  <h3 className="text-pink-800 text-xl font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-pink-600 mb-1">{product.description}</p>
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
                    <button className="bg-pink-500 text-white rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                      View Morer
                    </button>
                  </Link>
                  <button
                    className="bg-pink-500 text-white rounded-2xl m-2 px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                    onClick={() => {
                      sendCartFetchRequest(
                        product._id,
                        localStorage.getItem("token")
                      );
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
                className="border border-pink-500 mb-4 rounded-2xl py-4 mr-4 ml-4 mt-4 shadow-xl min-h-xl"
                style={{ width: "20vw", height: "30vw" }}
              >
                <img
                  src={`http://localhost:3900/${product.forms[0].image_filename}`}
                  className="h-100 w-full object-cover rounded-2xl"
                  style={{ height: "15vw", width: "20vw" }}
                />
                <div className="p-4">
                  <h3 className="text-pink-800 text-xl font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-pink-600 mb-1">{product.description}</p>
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
                    <button className="bg-pink-500 text-white rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300">
                      View More
                    </button>
                  </Link>
                  <button
                    className="bg-pink-500 text-white rounded-2xl m-2 px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                    onClick={() => {
                      sendCartFetchRequest(
                        product._id,
                        localStorage.getItem("token")
                      );
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
  );
};

export default Products;
