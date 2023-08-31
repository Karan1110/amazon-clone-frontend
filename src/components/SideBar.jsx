import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const images = [
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",
  "https://media.istockphoto.com/id/1007108388/photo/strike-a-pose.jpg?s=612x612&w=0&k=20&c=gfXau8bi07KoySiRWAA4VKc-zuNM39BmQM7Zcz88B8Y=",

  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&w=1000&q=80",

  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  // Add more image URLs here
];

const SideBar = () => {
  const galleryRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  // Function to handle clicking on the left button
  const handleLeftClick = () => {
    // setCurrentImage((prevImage) =>
    //   prevImage === 0 ? images.length - 1 : prevImage - 1
    // );

    const galleryWidth = galleryRef.current.offsetWidth;
    galleryRef.current.scrollTo({
      left: galleryWidth,
      behavior: "smooth",
    });
  };

  // Function to handle clicking on the right button
  const handleRightClick = () => {
    setCurrentImage((prevImage) =>
      prevImage === images.length - 1 ? 0 : prevImage + 1
    );
  };

  // Automatically scroll to the right image every 3 seconds
  useEffect(() => {
    const interval = setInterval(handleRightClick, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-200 h-100vw bg-white mt-1 shadow-2xl overflow-hidden relative z-index-0 ">
      <div
        ref={galleryRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 0}%)`,
        }}
      >
        <img
          src={images[currentImage]}
          alt={`Image ${currentImage + 1}`}
          className="w-full object-cover z-index-0"
          style={{ height: "40vw", width: "100vw", zIndex: -1 }}
        />
      </div>
      <button
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md absolute left-4 top-1/2 transform -translate-y-2/4"
        onClick={handleLeftClick}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-black" />
      </button>
      <button
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md absolute right-4 top-1/2 transform -translate-y-2/4"
        onClick={handleRightClick}
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-black" />
      </button>
    </div>
  );
};

export default SideBar;
