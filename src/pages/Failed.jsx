import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const FailedComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <div className="flex items-center justify-center text-red-500 text-6xl mb-6">
          <FontAwesomeIcon icon={faTimesCircle} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">
          Operation Failed
        </h1>
        <p className="text-gray-600 text-center">
          Sorry, the requested operation could not be completed. Please try
          again later.
        </p>
        <Link to="/">
          <button className="mt-6 bg-red-500 hover:bg-red-600 text-white rounded-2xl px-4 py-2 w-full transition duration-300">
            Browse our products
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FailedComponent;
