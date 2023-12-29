import React, { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"

const images = [
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",

  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80",

  "https://media.istockphoto.com/id/1007108388/photo/strike-a-pose.jpg?s=612x612&w=0&k=20&c=gfXau8bi07KoySiRWAA4VKc-zuNM39BmQM7Zcz88B8Y=",

  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  // Add more image URLs here
]

const SideBar = () => {
  const galleryRef = useRef(null)
  const [currentImage, setCurrentImage] = useState(0)

  const handleRightClick = () => {
    setCurrentImage((prevImage) =>
      prevImage === images.length - 1 ? 0 : prevImage + 1
    )
  }

  useEffect(() => {
    // Automatically scroll to the right image every 3 seconds
    const interval = setInterval(handleRightClick, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div
        className="w-200 h-100vw bg-white  overflow-hidden relative"
        style={{ zIndex: -1 }}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: 2000,
            transform: `translateX(-${currentImage * 0.2}%)`,
          }}
        >
          <img
            src={images[currentImage]}
            alt={`Image-${currentImage + 1}`}
            className="w-full object-cover shadow-md "
            style={{
              height: "40vw",
              width: "100%",
              zIndex: -100000000000000000000000000000000000,
            }}
          />
        </div>
      </div>
      <div className="flex flex-column mt-3 text-center items-center justify-center">
        {images.map((_, index) => (
          <button
            key={index}
            className={`${
              currentImage === index ? "bg-blue-500" : "bg-gray-500"
            } w-5 h-5 m-2 text-center rounded-full `}
            style={{}}
            onClick={() => {
              setCurrentImage(index)
              console.log(index)
            }}
          ></button>
        ))}
      </div>
    </>
  )
}

export default SideBar
