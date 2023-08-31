import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const ordered_products = useStore((state) => state.ordered_products);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log(ordered_products);
    }, 500);
  }, []);

  if (isLoading || !ordered_products) {
    return (
      // Skeleton Loading UI or other loading state
      // You can customize this part as needed
      <div className="p-4 flex items-center justify-center text-center ">
        <div
          className="border-t-4 border-pink-600 rounded-full animate-spin"
          style={{ height: "10vw", width: "10vw" }}
        ></div>
      </div>
    );
  }
  return (
    <div
      className="w-screen bg-pink-100 flex flex-col min-h-screen items-center justify-start"
      style={{ width: "99vw" }}
    >
      {ordered_products.length < 0 ? (
        <>
          <div>
            {/* Ordered Products Section */}
            <div className="flex items-center justify-center mb-6 mt-10">
              <FontAwesomeIcon
                className="text-pink-500"
                icon={faUser}
                style={{ width: "10vw", height: "5vw" }}
              ></FontAwesomeIcon>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-pink-800 text-3xl font-bold"></h2>
              <p className="text-pink-600 text-lg"></p>
            </div>
            <div className="w-full">
              <div className="bg-pink-50 p-6 rounded-2xl shadow-xl w-96 md:w-full">
                <h3 className="text-pink-800 text-center text-xl font-bold mb-6 text-center w-full">
                  Ordered Products
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-red-200 p-4 mb-6 mt-10 rounded-2xl">
            No products ordered yet.
          </div>
        </>
      ) : (
        // Display profile and ordered products (Same as before)
        <div>
          {/* Ordered Products Section */}
          <div className="flex items-center justify-center mb-6 mt-10">
            <FontAwesomeIcon
              className="text-pink-500"
              icon={faUser}
              style={{ width: "10vw", height: "5vw" }}
            ></FontAwesomeIcon>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-pink-800 text-3xl font-bold">{user.name}</h2>
            <p className="text-pink-600 text-lg">{user.address.city}</p>
          </div>
          <div className="w-full">
            <div className="bg-pink-50 p-6 rounded-2xl shadow-xl w-96 md:w-full">
              <h3 className="text-pink-800 text-center text-xl font-bold mb-6 text-center w-full">
                Ordered Products
              </h3>
              {/* Loop through the products array and render each product */}
              <div className="grid  md:grid-cols-3 lg:grid-cols-4 gap-4 m-4 w-full">
                {ordered_products.map((product, index) => (
                  <div
                    key={index}
                    className="border mt-4 border-pink-500 rounded-2xl  shadow-xl"
                  >
                    <img
                      src={`http://localhost:3900/${product.product.forms[0].image_filename}`}
                      className="max-h-100 w-full object-cover rounded-2xl"
                      alt={product.product.title}
                    />
                    <div className="p-4">
                      <h3 className="text-pink-800 text-xl font-semibold mb-2">
                        {product.product.title}
                      </h3>
                      <p className="text-pink-600 mb-4">
                        {product.product.description}
                      </p>
                      <button
                        className="bg-pink-500 text-white rounded-2xl px-4 py-2 mt-2 hover:bg-pink-600 transition duration-300"
                        onClick={() =>
                          navigate(`/product/${product.product._id}`)
                        }
                      >
                        View More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
