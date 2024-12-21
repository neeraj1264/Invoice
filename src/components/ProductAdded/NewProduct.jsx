import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TbCameraPlus } from "react-icons/tb";
import { FaTimes, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewProduct.css";
import { fetchCategories, addCategory } from "../../api";

const toastOptions = {
  position: "bottom-right",
  autoClose: 2000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const NewProduct = ({ setSelectedProducts }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    varieties: [], // Stores size and price combinations
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [productVariety, setProductVariety] = useState({ size: "", price: "" });
  const [isWithVariety, setIsWithVariety] = useState(false); // Toggle for variety

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const savedCategories = await fetchCategories();
        setCategories(savedCategories.map((category) => category.name));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      let newCategoryTrimmed = newCategory.trim();
  
      // Convert the first letter to uppercase and the rest to lowercase
      newCategoryTrimmed = newCategoryTrimmed.charAt(0).toUpperCase() + newCategoryTrimmed.slice(1).toLowerCase();
  
      if (!categories.includes(newCategoryTrimmed)) {
        try {
          const addedCategory = await addCategory(newCategoryTrimmed);
          setCategories((prev) => [...prev, addedCategory.name]);
          setNewCategory('');
        } catch (error) {
          console.error('Error adding category:', error);
        }
      }
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProduct((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleAddVariety = () => {
    if (!productVariety.size || !productVariety.price) {
      toast.error("Please fill in size and price!", toastOptions);
      return;
    }
    const updatedVarieties = [...product.varieties, productVariety];
    setProduct((prev) => ({
      ...prev,
      varieties: updatedVarieties,
    }));
    setProductVariety({ size: "", price: "" });
  };

  const handleAddProduct = async () => {
    // Check for name field (always required)
    if (!product.name) {
      toast.error("Please fill in the product name!", toastOptions);
      return;
    }

    // When "Add Varieties" is checked
    if (isWithVariety) {
      if (product.varieties.length === 0) {
        toast.error("Please add at least one variety!", toastOptions);
        return;
      }
    } else {
      // When "Add Varieties" is NOT checked, validate the price field
      if (!product.price) {
        toast.error("Please fill in the product price!", toastOptions);
        return;
      }
    }

    // Check if the product already exists in the same category
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    const isProductExist = storedProducts.some(
      (prod) =>
        prod.name.toLowerCase() === product.name.toLowerCase() &&
        prod.category.toLowerCase() === product.category.toLowerCase()
    );

    if (isProductExist) {
      toast.error("This product already exists!", toastOptions);
      return;
    }

    try {
      // Send product data to backend (API call)
      const response = await fetch(
        "https://invoice-5vnp09gr.b4a.run/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save the product");
      }

      const savedProduct = await response.json();
      console.log("Product saved:", savedProduct);

      // Reset the form fields
      setProduct({
        name: "",
        price: "",
        image: "",
        category: "",
        varieties: [],
      });

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1000);
    } catch (error) {
      toast.error("Error saving product!", toastOptions);
      console.error(error);
    }
  };

  const handleNavigateToInvoice = () => {
    navigate("/invoice");
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="catologue-header">New Product</h1>
      <div className="catologue-input-fields">
        <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <div className="image-container">
          <div
            className="camera"
            onClick={() => document.getElementById("imageInput").click()}
          >
            <TbCameraPlus className="camera-icon" />
            <p className="img-text">Add Image</p>
          </div>

          {product.image && (
            <div className="image-preview-container">
              <img
                src={product.image}
                alt="Preview"
                className="image-preview"
                style={{ width: "4.5rem", height: "4.5rem", padding: "0 1rem" }}
              />
              <FaTimes className="remove-icon" onClick={removeImage} />
            </div>
          )}
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name*"
          value={product.name}
          onChange={handleInputChange}
        />

        {!isWithVariety && (
          <input
            type="number"
            name="price"
            placeholder="₹ price"
            value={product.price}
            onChange={handleInputChange}
          />
        )}

        {/* Toggle to enable or disable varieties */}
        <div className="toggle-variety">
          <label>
            <input
              type="checkbox"
              checked={isWithVariety}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIsWithVariety(isChecked);

                // Clear price if Add Varieties is checked
                if (isChecked) {
                  setProduct((prev) => ({
                    ...prev,
                    price: "",
                  }));
                }
              }}
            />
            Add Varieties
          </label>
        </div>

        {isWithVariety && (
          <div className="varieties-container">
            <input
              type="text"
              placeholder="Size (e.g., 1L, 2L)"
              value={productVariety.size}
              onChange={(e) =>
                setProductVariety((prev) => ({ ...prev, size: e.target.value }))
              }
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={productVariety.price}
              onChange={(e) =>
                setProductVariety((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
            <button onClick={handleAddVariety}>Add Variety</button>
          </div>
        )}

        <ul>
          {product.varieties.map((variety, index) => (
            <li key={index}>
              {variety.size} - ₹{variety.price}
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <select
            name="category"
            className="dropdown"
            value={product.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category*</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleAddCategory}
            className="add-category-input"
          />
        </div>
      </div>
      <button className="save-button" onClick={handleAddProduct}>
        Save
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <FaCheckCircle className="tick-icon" />
            <h2>Success!</h2>
            <p>Product Added Successfully</p>
          </div>
        </div>
      )}

      <button onClick={handleNavigateToInvoice} className="Invoice-btn">
        Invoice
        <FaArrowRight className="Invoice-arrow" />
      </button>
    </div>
  );
};

export default NewProduct;
