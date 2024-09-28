import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Invoice.css";
import {
  FaMinusCircle,
  FaPlusCircle,
  FaArrowRight,
  FaArrowLeft,
  FaTimesCircle,
} from "react-icons/fa";

const Invoice = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsToSend, setProductsToSend] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate(); // For navigation

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

   // Filter products based on the search query
   const filteredProducts = selectedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load products from localStorage on component mount
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    setSelectedProducts(products);

    // Load productsToSend from localStorage if any exist
    const storedProductsToSend =
      JSON.parse(localStorage.getItem("productsToSend")) || [];
    setProductsToSend(storedProductsToSend);
  }, []);

  // Function to handle adding a product
  const handleAddToWhatsApp = (product) => {
    const updatedProductsToSend = [
      ...productsToSend,
      { ...product, quantity: 1 },
    ];
    setProductsToSend(updatedProductsToSend);
    localStorage.setItem(
      "productsToSend",
      JSON.stringify(updatedProductsToSend)
    ); // Save to localStorage
  };

  // Function to handle quantity changes
  const handleQuantityChange = (productName, delta) => {
    const updatedProductsToSend = productsToSend
      .map((prod) => {
        if (prod.name === productName) {
          const newQuantity = prod.quantity + delta;
          if (newQuantity < 1) {
            // Remove the product if quantity goes below 1
            return null;
          }
          return { ...prod, quantity: newQuantity };
        }
        return prod;
      })
      .filter(Boolean); // Remove any null values

    setProductsToSend(updatedProductsToSend);
    localStorage.setItem(
      "productsToSend",
      JSON.stringify(updatedProductsToSend)
    ); // Save to localStorage
  };

    // Function to remove a product from selected products and productsToSend
    const handleRemoveProduct = (productName) => {
      const updatedSelectedProducts = selectedProducts.filter(
        (prod) => prod.name !== productName
      );
      const updatedProductsToSend = productsToSend.filter(
        (prod) => prod.name !== productName
      );
  
      setSelectedProducts(updatedSelectedProducts);
      setProductsToSend(updatedProductsToSend);
  
      localStorage.setItem("products", JSON.stringify(updatedSelectedProducts)); // Update selected products in localStorage
      localStorage.setItem(
        "productsToSend",
        JSON.stringify(updatedProductsToSend)
      ); // Update productsToSend in localStorage
    };

  // Function to calculate total price based on quantities
  const calculateTotalPrice = () => {
    return productsToSend.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 20); // Assuming a base fee of ₹20
  };

  // Navigate to the customer details page
  const handleDone = () => {

    if (productsToSend.length === 0) {
      alert("Please add at least one product before proceeding.");
      return; // Prevent navigation if no products are selected
    }

    // Store the selected products and total amount in localStorage before navigating
    localStorage.setItem("selectedProducts", JSON.stringify(productsToSend));
    localStorage.setItem("totalAmount", calculateTotalPrice());
    navigate("/customer-detail"); // Navigate to customer detail page
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <FaArrowLeft className="back-arrow" onClick={handleBack} />
      <h1 className="invoice-header">Invoice Page</h1>

         {/* Add a search input to filter products */}
         <input
        style={{  
                margin: "4rem 0 1rem .5rem" , 
                width: "90%",
              }}
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search products..."
        className="search-input"
      />

      <div 
      style={{
        marginBottom: "3rem"
      }}
      >
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, index) => (
          <div key={index}>
            <div className="main-box">
              <div className="img-box">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "3rem", height: "3rem" }}
                  />
                ) : (
                  <FaImage style={{ width: "3rem", height: "3rem" }} />
                )}
              </div>

              <div className="sub-box">
                <h3>
                  {product.name} ~ {product.size}
                </h3>
                {/* Show base price in invoice */}
                <p style={{ color: "grey", fontWeight: 700 }}>
                  Price:{" "}
                  <span style={{ color: "black", fontWeight: 800 }}>
                    ₹ {product.price}
                  </span>{" "}
                  {/* <del>₹{product.mrp}</del> */}
<span   className="remove-btn"
                  onClick={() => handleRemoveProduct(product.name)}> 
                  <FaTimesCircle />
                  </span>
                </p>

              </div>

              {productsToSend.some((prod) => prod.name === product.name) ? (
                <div className="quantity-btns">
                  <button
                    className="icons"
                    onClick={() => handleQuantityChange(product.name, -1)}
                  >
                    <FaMinusCircle />
                  </button>
                  <span style={{ margin: "0 .4rem" }}>
                    {productsToSend.find((prod) => prod.name === product.name)
                      ?.quantity || 1}
                  </span>
                  <button
                    className="icons"
                    onClick={() => handleQuantityChange(product.name, 1)}
                  >
                    <FaPlusCircle />
                  </button>
                </div>
              ) : (
                <div className="btn-box">
                  <button
                    onClick={() => handleAddToWhatsApp(product)}
                    className="add-btn"
                  >
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
      </div>
      {/* Display the total price */}
      <button onClick={handleDone} className="done">
        Next
        <FaArrowRight className="Invoice-arrow" />
      </button>
    </div>
  );
};

export default Invoice;
