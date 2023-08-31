import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-white bottom-0 py-6  mt-5 shadow-2xl border-pink-300"
      style={{ height: "10vw" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-blue-900 text-2xl font-bold mb-4">
              Contact Us
            </h3>
            <p className="text-blue-900">123 Pink Street</p>
            <p className="text-blue-900">Pink City, PK 12345</p>
            <p className="text-blue-900">Email: info@example.com</p>
            <p className="text-blue-900">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h3 className="text-blue-900 text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-900 hover:text-pink-100 transition duration-300"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-blue-900 hover:text-pink-100 transition duration-300"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-blue-900 hover:text-pink-100 transition duration-300"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
