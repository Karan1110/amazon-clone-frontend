const productsStore = async (set) => {
  const products_response = await fetch("http://localhost:3900/api/products");
  const data = await products_response.json();

  const top_products_response = await fetch(
    "http://localhost:3900/api/products/top-products"
  );

  const data2 = await top_products_response.json();

  const trending_products_response = await fetch(
    "http://localhost:3900/api/products/trending-products"
  );

  const data3 = await trending_products_response.json();

  set({
    products: data,
    top_products: data2,
    trending_products: data3,
  });
};

export default productsStore;
