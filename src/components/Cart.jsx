import useStore from "../store/index"

const Cart = ({
  cart,
  isSidebarOpen,
  faTimes,
  FontAwesomeIcon,
  handleSidebarClose,
  handleCheckout,
  isLoadingSidebar,
}) => {
  const addToCart = useStore((state) => state.addToCart)
  const removeFromCart = useStore((state) => state.removeFromCart)

  return (
    <div
      className={`overflow-y-auto overflow-x-hidden fixed top-0 left-0 h-full w-[370px] bg-pink-100 p-4 shadow-lg max-transition-transform min-w-64 duration-300 ${
        isSidebarOpen
          ? "transform translate-x-0"
          : "transform -translate-x-full ease-in"
      }`}
      style={{
        zIndex: 999999999999999999,
        scrollbarWidth: "thin",
        scrollbarColor: "#f472b6 #f9a8d4",
      }}
    >
      <div className="flex   sticky justify-end">
        <FontAwesomeIcon
          icon={faTimes}
          className="text-pink-800 text-lg cursor-pointer  sticky"
          onClick={handleSidebarClose}
        />
      </div>

      <h2 className="text-pink-900 mt-0 text-2xl font-bold">Cart</h2>
      <h1 className="mt-5 ml-2 text-black text-md font-semibold">
        Subtotal: ₹
        {cart.reduce(
          (accumulator, product) =>
            accumulator + product.price * product.quantity,
          0
        )}
      </h1>
      <button
        className="bg-pink-500 relative ml-2 mr-2 mb-3 mt-5 text-white rounded-full font-semibold px-4 py-2 hover:bg-pink-600 transition duration-300"
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
        <div className=" bg-pink-100 max-h-full">
          {cart.map((item, index) => (
            <div
              key={item._id}
              style={{ width: "12vw", height: "7vw" }}
              className="flex flex-row items-center m-5"
            >
              <img
                src={`http://localhost:3900/${
                  item.selectedForm
                    ? item.forms[item.selectedForm].image_filename
                    : item.forms[0].image_filename
                }`}
                className="h-100 w-full bg-white object-cover p-1 shadow-xl mr-2"
                style={{ width: "80px", height: "100px" }}
                alt="Product"
              />
              <div className="flex flex-grow flex-row">
                <p
                  style={{ display: "inline-block", whiteSpace: "nowrap" }}
                  className="font-semibold text-black mt-5 ml-2"
                >
                  {item.title}
                </p>

                <div className="flex items-center m-5">
                  <button
                    onClick={async () => await addToCart(item._id)}
                    className="bg-pink-500 text-xl text-white rounded-full px-2 py-0  hover:bg-pink-700 transition duration-300 mr-2"
                  >
                    +
                  </button>
                  <p className="font-semibold text-black text-sm mx-2">
                    {item.quantity}
                  </p>
                  <button
                    onClick={() => {
                      removeFromCart(item._id)
                      item.quantity--
                      if (item.quantity < 1) {
                        cart.splice(index, 1)
                      }
                    }}
                    className="bg-pink-500 text-xl text-white rounded-full px-3 py-0  hover:bg-pink-700 transition duration-300 mr-2"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cart
