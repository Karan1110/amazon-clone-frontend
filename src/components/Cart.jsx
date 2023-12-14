const Cart = ({
  cart,
  isSidebarOpen,
  faTimes,
  FontAwesomeIcon,
  handleSidebarClose,
  handleCheckout,
  isLoadingSidebar,
}) => {
  return (
    <div
      className={`overflow-y-auto fixed top-0 left-0 h-full w-64 bg-pink-200 p-4 shadow-lg max-transition-transform max-w-64 duration-300 ${
        isSidebarOpen
          ? "transform translate-x-0"
          : "transform -translate-x-full ease-in"
      }`}
      style={{
        zIndex: 9999999,
        scrollbarWidth: "thin",
        scrollbarColor: "#f472b6 #f9a8d4",
        // top: 93,
        opacity: "100%",
      }}
    >
      <div className="flex relative inline-block sticky justify-end">
        <FontAwesomeIcon
          icon={faTimes}
          className="text-pink-800 text-lg cursor-pointer relative sticky"
          onClick={handleSidebarClose}
        />
      </div>

      <h2 className="text-pink-900 mt-0 text-2xl font-bold">Cart</h2>
      <h1 className="mt-1 ml-2 text-pink-900 text-md font-semibold">
        Subtotal:{" "}
        {cart.reduce((accumulator, product) => accumulator + product.price, 0)}
      </h1>
      <button
        className="bg-pink-500 relative ml-2 mr-2 mt-2 text-white rounded-2xl px-4 py-2 hover:bg-pink-600 transition duration-300"
        onClick={handleCheckout}
      >
        Check out.
      </button>
      {isLoadingSidebar ? (
        <div className="p-4 flex items-center justify-center text-center ">
          <div
            className="border-t-4 border-pink-600 rounded-full animate-spin"
            style={{ height: "10vw", width: "10vw" }}
          ></div>
        </div>
      ) : (
        <div className="w-auto  max-h-full">
          {cart.map((item) => (
            <div
              key={item._id}
              className="border p-2 border-pink-500 m-2 rounded-2xl shadow-xl"
              style={{ width: "12vw", height: "13vw" }}
            >
              <img
                src={`http://localhost:3900/${
                  item.selectedForm
                    ? item.forms[item.selectedForm].image_filename
                    : item.forms[0].image_filename
                }`}
                className="h-100 w-full object-cover rounded-2xl"
                style={{ width: "11vw", height: "120px" }}
                alt="Product"
              />

              <div className="p-2">
                <h3 className="text-pink-800 font-semibold m-1">
                  {item.title} - {item.quantity}
                </h3>
                <button className="bg-pink-500 text-white rounded-2xl px-4 py-2 hover:bg-pink-600 transition duration-300">
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cart
