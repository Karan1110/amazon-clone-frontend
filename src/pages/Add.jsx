import React, { useState } from "react"
import axios from "axios"

const Add = () => {
  const [product, setProduct] = useState({
    forms: [],
    title: "",
    price: "",
    category: "",
    description: "",
    brand: "",
    numberInStock: 0,
  })

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
    e.preventDefault()
    try {
      const formData = new FormData()

      // Append all photos as an array to the 'photos' field
      const photos = product.forms.map((form) => form.image)

      // Append each photo individually with the same field name
      photos.forEach((photo, index) => {
        formData.append("photos", photo)
      })

      // Convert the 'myForms' array to JSON and append it as a single array field 'forms'
      const myForms = product.forms.map((form) => ({ name: form.name }))
      formData.append("forms", JSON.stringify(myForms))

      // Append other product details
      formData.append("title", product.title)
      formData.append("description", product.description)
      formData.append("price", product.price)
      formData.append("category", product.category)
      formData.append("brand", product.brand)
      formData.append("numberInStock", product.numberInStock)

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
    } catch (error) {
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

  return (
    <div className="bg-pink-200 p-4">
      <div className="max-w-md mx-auto bg-white rounded p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Add Product</h2>
        <form onSubmit={handleSubmit}>
          {product.forms.map((form, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Form Name:
              </label>
              <input
                type="text"
                name={`forms[${index}].name`}
                value={form.name}
                onChange={(e) => handleFormNameChange(e, index)}
                className="border border-gray-400 rounded w-full py-2 px-3"
              />

              <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
                Form Image:
              </label>
              <input
                type="file"
                accept="image/*"
                id={`image-upload-${index}`}
                className="hidden"
                onChange={(e) => handleImageChange(e, index)}
              />
              {form.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt={`Form Image ${index}`}
                    className="w-24 h-24 mb-2 object-cover"
                  />
                </div>
              )}
              <label
                htmlFor={`image-upload-${index}`}
                className="cursor-pointer block text-center bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700 mt-2"
              >
                Select Image
              </label>
              <button
                type="button"
                onClick={() => removeForm(index)}
                className="text-red-500 mt-2 hover:text-red-700"
              >
                Remove Form
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addForm}
            className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700"
          >
            Add Form
          </button>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
              className="border border-gray-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="border border-gray-400 rounded w-full py-2 px-3 h-32 resize-none"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price:
            </label>
            <input
              type="text"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="border border-gray-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category:
            </label>
            <input
              type="text"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="border border-gray-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Brand:
            </label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="border border-gray-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Number in Stock
            </label>
            <input
              type="number"
              name="numberInStock"
              value={product.numberInStock}
              onChange={handleChange}
              className="border border-gray-400 rounded w-full py-2 px-3"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700"
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
