import React from "react"
import { Link } from "react-router-dom"

const StarRating = ({ averageRating }) => {
  const filledStars = Math.floor(averageRating)
  const hasHalfStar = averageRating % 1 !== 0

  const renderStars = () => {
    const stars = []

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <svg
          key={i}
          className="w-7 h-7 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-7 h-7 text-yellow-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 1.753L12.394 6.02l4.856.71-3.5 3.406.824 5.071-4.18-2.199V1.753z" />
        </svg>
      )
    }

    return stars
  }

  return (
    <div className="flex items-center mt-2.5 mb-5">
      {averageRating !== undefined && (
        <>
          {renderStars()}
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
            {averageRating.toFixed(1)}
          </span>
        </>
      )}
    </div>
  )
}

export { StarRating };

const ProductCard = ({ product,addToCart }) => {
  const totalRatings = product.ratings.length
  const averageRating =
    totalRatings > 0
      ? product.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
        totalRatings
      : 0

  return (
   
      <div className="max-w-2xl m-7">
      <div className="bg-white shadow-lg rounded-lg  max-w-sm dark:bg-gray-800 dark:border-gray-700">
         <Link to={`/product/${product._id}`}>
     
            <img
              className=" px-2  h-[350px] w-[280px]"
              src={`http://localhost:3900/${product.forms[0].image_filename}`}
              alt="product image"
        />
         </Link>
          <div className="px-3 pb-3">
          
              <h3 className="text-gray-900 font-semibold text-xl  mt-1 tracking-tight dark:text-white">
                {product.title}
              </h3>
            <StarRating averageRating={averageRating} />
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ₹{product.price}
              </span>
              <button
                onClick={()=> addToCart(product._id,product.title)}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
   
  )
}

export default ProductCard
