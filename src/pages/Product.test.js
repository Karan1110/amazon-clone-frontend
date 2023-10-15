import React from "react"
import { render, fireEvent, screen } from "@testing-library/react"
import Product from "./Product" // Import the Product component

// Mock the useHistory and useParams functions from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ title: "example-title" }),
  useNavigate: () => jest.fn(),
}))

// Mock the useProductStore
jest.mock("../store/index", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    top_products: [],
    product: {
      _id: "1",
      title: "Example Product",
      forms: [
        { id: 1, image_filename: "example.jpg", name: "Form 1" },
        { id: 2, image_filename: "example2.jpg", name: "Form 2" },
      ],
      description: "Description",
      price: 10,
      brand: "Example Brand",
      category: "Example Category",
      size: ["S", "M"],
      ratings: [],
    },
    addRating: jest.fn(),
    fetchProduct: jest.fn(),
  })),
}))

describe("Product Component", () => {
  test("renders product information when not loading", async () => {
    render(<Product />)

    // Wait for the product information to be displayed
    await screen.findByText("Example Product")

    // Check that product information is displayed
    expect(screen.getByText("Example Product")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("Price : $10")).toBeInTheDocument()
    expect(screen.getByText("Brand : Example Brand")).toBeInTheDocument()
    expect(screen.getByText("Category : Example Category")).toBeInTheDocument()
    expect(screen.getByText("Form 1")).toBeInTheDocument()
    expect(screen.getByText("Form 2")).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Order Now" })).toHaveLength(1)
    expect(screen.getAllByRole("button", { name: "Add to Cart" })).toHaveLength(
      1
    )
    expect(screen.getByText("Ratings")).toBeInTheDocument()
    expect(screen.getByText("Recommended Products")).toBeInTheDocument()
  })

  test("handles image click and opens modal", async () => {
    render(<Product />)
    const image = screen.getByAltText("Product")
    fireEvent.click(image)

    // Check that the modal is open
    const modal = screen.getByAltText("Enlarged")
    expect(modal).toBeInTheDocument()
  })
})
