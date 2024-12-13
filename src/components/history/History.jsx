import React, { useState, useEffect } from "react";
import "./History.css"; // Add styling for the table layout
import { FaArrowLeft } from "react-icons/fa";

const History = () => {
  const [customerDetails, setCustomerDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load data from localStorage on component mount
  useEffect(() => {
    const customerData = JSON.parse(localStorage.getItem("customerDetails")) || {};
    const productData = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const total = localStorage.getItem("totalAmount") || 0;

    setCustomerDetails(customerData);
    setProducts(productData);
    setTotalAmount(total);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
    <FaArrowLeft className="back-arrow" onClick={handleBack} />
    <h1 className="history-header">Order History</h1>
    <div className="history-container">

      {/* Product Details Table */}
      <div className="product-list">
        <h2>Products</h2>
        {products.length > 0 ? (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
                <th>Net Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price * product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Total Amount */}
      <div className="total-amount">
        <h2>Total Amount</h2>
        <p className="amount">₹{totalAmount}</p>
      </div>
    </div>
    </div>
  );
};

export default History;
