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

  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  let pressTimer;

  const handlePressStart = () => {
    // Set a timeout to show the remove button after 1 second (1000 ms)
    pressTimer = setTimeout(() => {
      setShowRemoveBtn(true);
    }, 1000);
  };

  const handlePressEnd = () => {
    // Clear the timeout if the user releases the press before 1 second
    clearTimeout(pressTimer);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = selectedProducts
  .filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .reduce((acc, product) => {
    const category = product.category || "Others";

    // Ensure the category key exists in the accumulator
    if (!acc[category]) {
      acc[category] = [];
    }

    // Add the product to the correct category group
    acc[category].push(product);

    return acc;
  }, {});


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
  
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    console.log("Loaded products:", products); // Debug log
    setSelectedProducts(products);
  }, []);
  
  return (
    <div>
      <FaArrowLeft className="back-arrow" onClick={handleBack} />
      <h1 className="invoice-header">Invoice Page</h1>
  
      {/* Add a search input to filter products */}
      <div>
        <input
          style={{
            margin: "-3.2rem 0 1rem .5rem",
            width: "90%",
          }}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="search-input"
        />
      </div>
  
      <div style={{ margin: "6rem 0 3rem 0" }}>
        {Object.keys(filteredProducts).length > 0 ? (
         Object.keys(filteredProducts)
         .sort((a, b) => a.localeCompare(b)) // Sort category names alphabetically
         .map((category, index) => (       
            <React.Fragment key={index}>
              <h2 className="category">{category}</h2>
              {filteredProducts[category].map((product, idx) => (
                <div key={idx} className="main-box">
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
  
                  <div
                    className="sub-box"
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                  >
                    <h3>
                      {product.name} {product.size ? `~ ${product.size}` : ""}
                    </h3>
                    <p style={{ color: "grey", fontWeight: 700 }}>
                      Price:{" "}
                      <span style={{ color: "black", fontWeight: 800 }}>
                        ₹ {product.price}
                      </span>
                      {showRemoveBtn && (
                        <span
                          className="remove-btn"
                          onClick={() => handleRemoveProduct(product.name)}
                        >
                          <FaTimesCircle />
                        </span>
                      )}
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
                        {
                          productsToSend.find(
                            (prod) => prod.name === product.name
                          )?.quantity || 1
                        }
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
              
              ))}
               <hr />
            </React.Fragment>
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
