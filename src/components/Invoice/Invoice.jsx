import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsToSend, setProductsToSend] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track quantities of products
  const navigate = useNavigate(); // For navigation

  // Load products from localStorage on component mount
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    setSelectedProducts(products);
  }, []);

  // Function to handle adding a product
  const handleAddToWhatsApp = (product) => {
    setProductsToSend((prev) => [...prev, { ...product, quantity: 1 }]); // Set quantity 1 initially
    setQuantities((prev) => ({ ...prev, [product.name]: 1 }));
  };

  // Function to handle quantity changes
  const handleQuantityChange = (productName, delta) => {
    setProductsToSend((prevProducts) => {
      return prevProducts.map((prod) => {
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
    });
  };

  // Function to calculate total price based on quantities
  const calculateTotalPrice = () => {
    return productsToSend.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 20);
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
      <h1>Invoice Page</h1>
      {selectedProducts.length > 0 ? (
        selectedProducts.map((product, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100px", height: "100px" }}
              />
            ) : (
              <FaImage style={{ fontSize: "100px" }} />
            )}
            <h3>{product.name}</h3>
            {/* Show base price in invoice */}
            <p>Price: ₹{product.price}</p>
            <p>MRP: ₹{product.mrp}</p>
            <p>Size: {product.size}</p>

            {productsToSend.some((prod) => prod.name === product.name) ? (
              <div>
                <button onClick={() => handleQuantityChange(product.name, -1)}>
                  -
                </button>
                <span style={{ margin: "0 1rem" }}>
                  {
                    productsToSend.find((prod) => prod.name === product.name)
                      ?.quantity || 1
                  }
                </span>
                <button onClick={() => handleQuantityChange(product.name, 1)}>
                  +
                </button>
              </div>
            ) : (
              <button onClick={() => handleAddToWhatsApp(product)}>
                Add
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No products selected</p>
      )}
      {/* Display the total price */}
      <h2>Total Amount: ₹{calculateTotalPrice()}</h2>
      <button onClick={handleDone}>Done</button>
    </div>
  );
};

export default Invoice;
