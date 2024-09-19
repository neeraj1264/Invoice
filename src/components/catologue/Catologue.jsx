// Catalog.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbCameraPlus } from "react-icons/tb";
import { FaTimes } from "react-icons/fa";
import './catologue.css';

const Catalog = ({ setSelectedProducts }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    size: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle file input (for image)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({
          ...prev,
          image: reader.result, // Store base64 image string
        }));
      };
      reader.readAsDataURL(file); // Convert image to base64 string
    }
  };

    // Function to remove the selected image
    const removeImage = () => {
      setProduct((prev) => ({
        ...prev,
        image: '',
      }));
    };

  const handleAddProduct = () => {
    if (product.name && product.price) {
      setSelectedProducts((prev) => [...prev, product]);
      setProduct({
        name: '',
        price: '',
        mrp: '',
        size: '',
        image: '',
      });
    } else {
      alert('Please fill in all the fields');
    }
  };

  const handleNavigateToInvoice = () => {
    navigate('/invoice');
  };

  return (
    <div>
      <h1 className='catologue-header'>New Product</h1>
      <div className='catologue-input-fields'>
             {/* Hidden file input */}
             <input
          type="file"
          accept="image/*"
          id="imageInput"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        {/* Camera icon to trigger file input */}
        <div className='image-container'>
        <div className="camera" onClick={() => document.getElementById('imageInput').click()}>
        <TbCameraPlus className="camera-icon"/>
          {/* <i className="fas fa-camera camera-icon"></i> */}
          <p  className='img-text'>Add Image</p>
        </div>
        
        {/* Image preview if an image is selected */}
        {product.image && (
            <div className="image-preview-container">
              <img
                src={product.image}
                alt="Preview"
                className="image-preview"
                style={{ width: '4.5rem', height: '4.5rem', padding: '0 1rem' }}
              />
              {/* X icon to remove image */}
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
        <div className='price-mrp'>
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
        </div>
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={product.size}
          onChange={handleInputChange}
        />

      </div>
      <button className="save-button" onClick={handleAddProduct}>Save</button>


      <button onClick={handleNavigateToInvoice}>Go to Invoice</button>
    </div>
  );
};

export default Catalog;