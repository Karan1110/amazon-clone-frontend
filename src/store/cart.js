import axios from "axios"

const cartStore = async (set) => {
  const authToken = localStorage.getItem("token")

  // Fetch user data
  const userResponse = await fetch("http://localhost:3900/api/users/me", {
    headers: {
      "x-auth-token": authToken,
    },
  })

  const userData = await userResponse.json()
  console.log(userData)

  set({
    cartItems: userData.cart,
    user: userData,
    addToCart: async function (productId) {
      try {
        const url = "http://localhost:3900/api/cart"

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": authToken,
          },
          body: JSON.stringify({ product_id: productId }),
        }

        const response = await fetch(url, requestOptions)
        if (!response.ok) {
          throw new Error(response)
        }

        const responseData = await response.json()
        console.log(responseData)
        // Assuming you want to update the state after adding an item to the cart
        set((state) => ({
          ...state,
          cartItems: responseData,
        }))
        return response
      } catch (error) {
        console.error("Error adding item to cart:", error)
      }
    },
    removeFromCart: function (productId) {
      axios
        .put(`http://localhost:3900/api/cart/decrement/${productId}`, null, {
          headers: {
            "x-auth-token": authToken,
          },
        })
        .then((response) => {
          console.log("Item decremented successfully:", response.data)

          // Assuming response.data is the updated cart items
          set((state) => ({
            ...state,
            cartItems: response.data,
          }))
        })
        .catch((error) => {
          console.error("Error decrementing item:", error.response.data)
        })
    },
  })
}

export default cartStore
