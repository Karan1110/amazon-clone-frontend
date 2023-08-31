import create from "zustand";
import cartStore from "./cart";
import productsStore from "./products";
import productStore from "./product";
import orderedStore from "./ordered";

const useStore = create((set) => ({
  ...cartStore(set),
  ...productsStore(set),
  ...productStore(set),
  ...orderedStore(set),
}));

export default useStore;
