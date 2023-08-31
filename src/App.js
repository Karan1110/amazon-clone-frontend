import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Failed from "./pages/Failed";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Order from "./pages/Order";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:title" element={<Product />} />
          <Route path="/products/:type" element={<Products />} />
          <Route path="/order/:id/:size/:form" element={<Order />} />
          <Route path="/failed" element={<Failed />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
