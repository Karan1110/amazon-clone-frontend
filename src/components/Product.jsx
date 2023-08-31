import React from "react";

const Product = ({ product }) => {
  return (
    <div className="border border-pink-500 rounded p-4">
      <div className="mt-2">
        <h3 className="text-pink-800 text-lg font-bold">hii</h3>
        <p className="text-pink-600">hii</p>
        <button className="bg-pink-500 text-white rounded px-4 py-2 mt-2">
          View More
        </button>
      </div>
    </div>
  );
};

export default Product;
