import { Link } from "react-router-dom"

function NotFound() {
  return (
    <div
      className="h-screen text-center flex items-center justify-center flex-col"
      style={{ height: "34vw" }}
    >
      <div className=" text-red-500 font-semibold text-2xl ">
        Page not found.
      </div>
      <Link to="/">
        <button className="rounded-2xl hover:bg-pink-700 font-semibold bg-pink-600 p-3 border-pink-800 mt-3">
          {" "}
          Browse Products
        </button>
      </Link>
    </div>
  )
}

export default NotFound
