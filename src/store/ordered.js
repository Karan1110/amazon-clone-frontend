const orderedStore = async (set) => {
  const response = await fetch("http://localhost:3900/api/orders/", {
    headers: {
      "x-auth-token": localStorage.getItem("token"), // Replace "ssss" with your actual token value
    },
  });

  const data = await response.json();
  console.log(data);
  set({
    ordered_products: data,
  });
};

export default orderedStore;
