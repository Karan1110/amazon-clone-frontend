import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import SideBar from "./components/SideBar.jsx" // Assuming that your SideBar component is in the same directory as the test file.

test("renders SideBar component with initial image", () => {
  render(<SideBar />)

  // Check that the initial image is displayed in the component
  const initialImage = screen.getByAltText("Image-1")
  expect(initialImage).toBeInTheDocument()
})

test("clicking on the right button should change the image back to Image-2", () => {
  render(<SideBar />)
  const rightButton = screen.getByTestId("right-button")

  // Click the right button to change the image back to Image-1
  fireEvent.click(rightButton)

  // Check that the image has changed back to "Image-1"
  const updatedImageRight = screen.getByAltText("Image-2")
  expect(updatedImageRight).toBeInTheDocument()
})

test("clicking on the left button should change to image-5", () => {
  render(<SideBar />)

  // Find the left button and click it
  const leftButton = screen.getByTestId("left-button")
  fireEvent.click(leftButton)

  // Check that the updated image has the alt text matching the updated image
  const updatedImage = screen.getByAltText("Image-5") // Updated the alt text
  expect(updatedImage).toBeInTheDocument()
})
