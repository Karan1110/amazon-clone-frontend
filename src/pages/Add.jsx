import axios from "axios"
import React, { useState, useRef, useMemo } from "react"
import JoditEditor from "jodit-react"
import { useNavigate } from "react-router-dom"

const Add = () => {
  const navigate = useNavigate
  const [product, setProduct] = useState({
    forms: [],
    title: "",
    price: "",
    category: "",
    description: "",
    brand: "",
    numberInStock: 0,
    size: [],
    color: [],
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleImageChange = (e, index) => {
    const files = e.target.files
    if (files && files[0]) {
      const updatedForms = [...product.forms]
      updatedForms[index] = {
        ...updatedForms[index],
        image: files[0],
      }
      setProduct({ ...product, forms: updatedForms })
    }
  }

  const addForm = () => {
    const newForm = {
      name: "",
      image: null,
    }
    setProduct({ ...product, forms: [...product.forms, newForm] })
  }

  const removeForm = (index) => {
    const updatedForms = [...product.forms]
    updatedForms.splice(index, 1)
    setProduct({ ...product, forms: updatedForms })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const formData = new FormData()

      // Append all photos as an array to the 'photos' field
      const photos = product.forms.map((form) => form.image)

      // Append each photo individually with the same field name
      photos.forEach((photo, index) => {
        formData.append("photos", photo)
      })

      const myForms = product.forms.map((form) => ({ name: form.name }))
      formData.append("forms", JSON.stringify(myForms))
      formData.append("title", product.title)
      formData.append("description", product.description)
      formData.append("price", product.price)
      formData.append("category", product.category)
      formData.append("brand", product.brand)
      formData.append("numberInStock", product.numberInStock)
      formData.append("size", JSON.stringify(product.size))
      formData.append("color", JSON.stringify(product.color))

      // Make a POST request to your API endpoint using Axios
      const response = await axios.post(
        "http://localhost:3900/api/products",
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      )

      console.log("Product data:", response.data)
      navigate("/success")
    } catch (error) {
      setError(error.message)
      console.error("Error adding product:", error)
    }
  }

  const handleFormNameChange = (e, index) => {
    const updatedForms = [...product.forms]
    updatedForms[index] = {
      ...updatedForms[index],
      name: e.target.value,
    }
    setProduct({ ...product, forms: updatedForms })
  }
  const handleColorChange = (index, value) => {
    setProduct((prevProduct) => {
      const newColor = [...prevProduct.color]
      newColor[index] = value
      return { ...prevProduct, color: newColor }
    })
  }

  const handleSizeChange = (index, value) => {
    setProduct((prevProduct) => {
      const newSize = [...prevProduct.size]
      newSize[index] = value
      return { ...prevProduct, size: newSize }
    })
  }

  const handleAddSize = () => {
    setProduct({ ...product, size: [...product.size, ""] })
  }
  const handleAddColor = () => {
    setProduct({ ...product, color: [...product.color, ""] })
  }

  const handleRemoveColor = (index) => {
    const newColor = [...product.color]
    newColor.splice(index, 1)
    setProduct({ ...product, color: newColor })
  }
  const handleRemoveSize = (index) => {
    const newSize = [...product.size]
    newSize.splice(index, 1)
    setProduct({ ...product, size: newSize })
  }
  const handleSvgClick = () => {
    setError(null)
  }
  const editor = useRef(null)
  return (
    <div className=" p-4 mt-3">
      <div className="max-w-4xl mx-auto bg-white rounded-full p-8 ">
        <h2 className="text-2xl font-bold  text-center mb-4">Add Product</h2>
        {error && (
          <div
            className="bg-red-100 border m-5 border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                className="fill-current h-6 w-6 text-red-500"
                onClick={handleSvgClick}
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter the product title"
              value={product.title}
              onChange={handleChange}
              className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full h-[65px] w-full py-2 px-3  "
            />
          </div>
          <div className="mb-4  ">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Description
            </label>
            <JoditEditor
              ref={editor}
              value={product.description}
              tabIndex={1}
              onBlur={(newContent) =>
                setProduct({ ...product, description: newContent })
              }
              onChange={(newContent) => {
                console.log(product.description)
                setProduct({ ...product, description: newContent })
              }}
              className="w-full h-[50px]"
              style={{
                zIndex: -999999999999999999999999999,
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Price
            </label>
            <input
              type="text"
              name="price"
              placeholder="Enter the the product's price"
              value={product.price}
              onChange={handleChange}
              className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full      py-2 px-3  h-[65px]"
            />
          </div>
          {product.color.map((size, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Enter the product's color"
                className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full      py-2 px-3  h-[65px]"
                value={size}
                onChange={(e) => handleColorChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveColor(index)}
                className="bg-pink-500 font-bold text-white py-2 px-4 m-2 rounded-full hover:bg-pink-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-pink-500 text-white m-2 py-2 px-4 rounded-full font-bold  hover:bg-pink-700"
            onClick={handleAddColor}
          >
            Add Color
          </button>
          {product.size.map((size, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Enter the product's size"
                className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full      py-2 px-3  h-[65px]"
                value={size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveSize(index)}
                className="bg-pink-500 font-bold  text-white py-2 px-4 m-2 rounded-full hover:bg-pink-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-pink-500 text-white m-2 py-2 px-4 rounded-full font-bold  hover:bg-pink-700"
            onClick={handleAddSize}
          >
            Add Size
          </button>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Enter the product's category "
              value={product.category}
              onChange={handleChange}
              className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full py-2 px-3  h-[65px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full py-2 px-3  h-[65px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              Number in Stock
            </label>
            <input
              type="number"
              name="numberInStock"
              placeholder="Enter the products stock"
              value={product.numberInStock}
              onChange={handleChange}
              className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full py-2 px-3  h-[65px]"
            />
          </div>
          <div className="text-center">
            {product.forms.map((form, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 text-lg font-bold mb-2">
                  Form Name
                </label>
                <input
                  type="text"
                  name={`forms[${index}].name`}
                  value={form.name}
                  placeholder="Enter the product's form name"
                  onChange={(e) => handleFormNameChange(e, index)}
                  className="border focus:border-purple-500  outline-none   border-purple-500    rounded-full w-full py-2 px-3  h-[65px]"
                />

                <label className="block text-gray-700 text-lg font-bold mb-2 mt-4">
                  Form Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Enter the product form's image"
                  id={`image-upload-${index}`}
                  className="hidden"
                  onChange={(e) => handleImageChange(e, index)}
                />
                {form.image && (
                  <div className="mt-2 text-center flex items-center justify-center  ">
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt={`Form Image ${index}`}
                      className="w-24 h-24 mb-2 text-center object-cover"
                    />
                  </div>
                )}
                <label
                  htmlFor={`image-upload-${index}`}
                  className=" text-pink-500  py-2 m-2 px-4 text-center font-bold rounded-full hover:text-pink-700 cursor-pointer"
                >
                  Select Image
                </label>
                <button
                  type="button"
                  onClick={() => removeForm(index)}
                  className="text-red-500 mt-2 font-bold hover:text-red-700"
                >
                  Remove Form
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addForm}
              className="bg-pink-500 text-white m-7  py-2 m-2 px-4 text-center font-bold rounded-full hover:bg-pink-700"
            >
              Add Form
            </button>
            <button
              type="submit"
              className="bg-pink-500 m-7 text-center block text-white py-2 px-4 font-bold rounded-full hover:bg-pink-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Add
