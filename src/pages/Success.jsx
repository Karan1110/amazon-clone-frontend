import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex items-center justify-center text-green-500 text-6xl mb-6">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">
          Operation Successful.
        </h1>
        <p className="text-gray-600 text-center">
          Congrats! the order has been placed Successfully.
        </p>
        <Link to="/">
          <button className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl px-4 py-2 w-full transition duration-300">
            Browse more of our products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
