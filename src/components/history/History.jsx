import React, { useState, useEffect } from "react";
import "./History.css"; // Add styling for the table layout
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);

    // Calculate the grand total of all orders
    const total = savedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    setGrandTotal(total);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

// Helper function to format date and show relative time with time
const formatDate = (isoString) => {
  const orderDate = new Date(isoString);
  const currentDate = new Date();
  
  const diffTime = currentDate - orderDate; // Difference in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days

  const hours = orderDate.getHours();
  const minutes = orderDate.getMinutes();
  const formattedTime = `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}`;

  if (diffDays === 0) {
    return `Today at ${formattedTime}`; // If the order was today
  } else if (diffDays === 1) {
    return `Yesterday at ${formattedTime}`; // If the order was yesterday
  } else if (diffDays < 7) {
    return `${diffDays} days ago at ${formattedTime}`; // If the order was within the past week
  } else {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return `${orderDate.toLocaleDateString(undefined, options)} at ${formattedTime}`; // If the order was older than a week, return the full date with time
  }
};


  return (
    <div>
      <FaArrowLeft className="back-arrow" onClick={handleBack} />
      <h1 className="history-header fixed-top">Order History</h1>
      <div className="history-container">

        {/* Grand Total Display */}
        <div className="grand-total">
          <h2 className="total-sale">Total Sales: ₹{grandTotal}</h2>
        </div>
    <hr />
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={order.id} className="order-section">
              <h2>Order {index + 1} - <span>{formatDate(order.timestamp)}</span></h2>
              <p><strong>Amount Received: ₹{order.totalAmount}</strong> </p>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price (₹)</th>
                    <th>Quantity</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, idx) => (
                    <tr key={idx}>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price * product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default History;
