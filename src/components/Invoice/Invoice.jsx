import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import './Invoice.css';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const Invoice = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsToSend, setProductsToSend] = useState([]);
  const navigate = useNavigate(); // For navigation

  // Load products from localStorage on component mount
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    setSelectedProducts(products);

    // Load productsToSend from localStorage if any exist
    const storedProductsToSend = JSON.parse(localStorage.getItem("productsToSend")) || [];
    setProductsToSend(storedProductsToSend);
  }, []);

  // Clear 'productsToSend' from localStorage on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("productsToSend");
    };
    
    // Set the event listener for page reload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Function to handle adding a product
  const handleAddToWhatsApp = (product) => {
    const updatedProductsToSend = [...productsToSend, { ...product, quantity: 1 }];
    setProductsToSend(updatedProductsToSend);
    localStorage.setItem("productsToSend", JSON.stringify(updatedProductsToSend)); // Save to localStorage
  };

  // Function to handle quantity changes
  const handleQuantityChange = (productName, delta) => {
    const updatedProductsToSend = productsToSend.map((prod) => {
      if (prod.name === productName) {
        const newQuantity = prod.quantity + delta;
        if (newQuantity < 1) {
          // Remove the product if quantity goes below 1
          return null;
        }
        return { ...prod, quantity: newQuantity };
      }
      return prod;
    }).filter(Boolean); // Remove any null values

    setProductsToSend(updatedProductsToSend);
    localStorage.setItem("productsToSend", JSON.stringify(updatedProductsToSend)); // Save to localStorage
  };

  // Function to calculate total price based on quantities
  const calculateTotalPrice = () => {
    return productsToSend.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 20); // Assuming a base fee of ₹20
  };

  // Navigate to the customer details page
  const handleDone = () => {
    // Store the selected products and total amount in localStorage before navigating
    localStorage.setItem("selectedProducts", JSON.stringify(productsToSend));
    localStorage.setItem("totalAmount", calculateTotalPrice());
    navigate("/customer-detail"); // Navigate to customer detail page
  };

  return (
    <div>
      <h1 className="invoice-header">Invoice Page</h1>
      {selectedProducts.length > 0 ? (
        selectedProducts.map((product, index) => (
          <div key={index}>
            <div className="main-box">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "4rem", height: "4rem" }}
                />
              ) : (
                <FaImage style={{ width: "4rem", height: "4rem" }} />
              )}
              <div className="sub-box">
                <h3>{product.name} ~ {product.size}</h3>
                {/* Show base price in invoice */}
                <p>Price: ₹{product.price}</p>
                <p>MRP: ₹{product.mrp}</p>
              </div>
              {productsToSend.some((prod) => prod.name === product.name) ? (
                <div className="quantity-btns">
                  <button className="icons" onClick={() => handleQuantityChange(product.name, -1)}>
                    <FaMinusCircle />
                  </button>
                  <span style={{ margin: "0 .4rem" }}>
                    {
                      productsToSend.find((prod) => prod.name === product.name)
                        ?.quantity || 1
                    }
                  </span>
                  <button className="icons" onClick={() => handleQuantityChange(product.name, 1)}>
                    <FaPlusCircle />
                  </button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleAddToWhatsApp(product)} className="add-btn">
                    Add
                  </button>
                </div>
              )}
            </div>
            {/* Add horizontal line after each product detail */}
            <hr />
          </div>
        ))
      ) : (
        <p>No products selected</p>
      )}
      {/* Display the total price */}
      <button onClick={handleDone} className="done">Next</button>
    </div>
  );
};

export default Invoice;
