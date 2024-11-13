import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbCameraPlus } from "react-icons/tb";
import {
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewProduct.css";

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
    mrp: "",
    size: "",
    image: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
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

  // Remove image
  const removeImage = () => {
    setProduct((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Add product to localStorage

  // const handleAddProduct = () => {
  //   if (product.name && product.price) {
  //     const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  //     const updatedProducts = [...storedProducts, product];
  //     localStorage.setItem("products", JSON.stringify(updatedProducts));

  //     // Reset form
  //     setProduct({
  //       name: "",
  //       price: "",
  //       mrp: "",
  //       size: "",
  //       image: "",
  //     });

  //     setShowPopup(true);

  //   setTimeout(() => {
  //     setShowPopup(false);
  //   }, 500);

  //   } else {
  //     alert("Please fill in required fields!");
  //   }
  // };

  const handleAddProduct = () => {
    if (!product.name || !product.price) {
      // toast.error(``, {
      //   className: "toast-error",
      //   icon: "⚠️",
      // });
      toast.error("Please fill in the required fields!", toastOptions);

      return;
    }

    // Get the stored products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    // Check if the product already exists based on name, price, and size
    const isProductExist = storedProducts.some(
      (prod) =>
        prod.name.toLowerCase() === product.name.toLowerCase() &&
        prod.price === product.price &&
        prod.size.toLowerCase() === product.size.toLowerCase()
    );

    if (isProductExist) {
      // Show error toast if the product already exists
      toast.error("This product is already exist!", toastOptions);
      return;
    }

    // Add the new product to the stored products list
    const updatedProducts = [...storedProducts, product];
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Reset form
    setProduct({
      name: "",
      price: "",
      mrp: "",
      size: "",
      image: "",
    });

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1000);
  };

  const handleNavigateToInvoice = () => {
    navigate("/invoice");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <ToastContainer
        className="custom-toast-container"
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* <FaArrowLeft className="back-arrow" onClick={()=> handleBack()}/> */}
      <h1 className="catologue-header"> New Product</h1>
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
        <input
          type="number"
          name="price"
          placeholder="₹ Sale price*"
          value={product.price}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="mrp"
          placeholder="₹ MRP"
          value={product.mrp}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={product.size}
          onChange={handleInputChange}
        />
      </div>
      <button className="save-button" onClick={handleAddProduct}>
        Save
      </button>

      {/* Popup modal */}
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
