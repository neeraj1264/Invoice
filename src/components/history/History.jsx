import React, { useState, useEffect } from "react";
import "./History.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [filter, setFilter] = useState("Today"); // State for selected filter
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);

    // Filter today's and previous orders
    const todayOrders = savedOrders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= startOfToday;
    });

    const previousOrders = savedOrders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate < startOfToday;
    });

    // Set the filtered orders based on the default filter
    setFilteredOrders(filter === "Today" ? todayOrders : previousOrders);

    // Calculate totals
    const total = (filter === "Today" ? todayOrders : previousOrders).reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    setGrandTotal(total);
  }, [filter]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (isoString) => {
    const orderDate = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    // Clear time part for comparison
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
    // Format time in 12-hour format with AM/PM
    const hours = orderDate.getHours();
    const minutes = orderDate.getMinutes();
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12; // 12-hour format
    const formattedMinutes = minutes > 9 ? minutes : `0${minutes}`;
    const period = isPM ? "PM" : "AM";
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
  
    if (orderDate >= startOfToday) {
      return `Today at ${formattedTime}`;
    } else if (orderDate >= startOfYesterday && orderDate < startOfToday) {
      return `Yesterday at ${formattedTime}`;
    } else {
      return `${formattedTime}`; // Just return time for older orders
    }
  };
  

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <div className="history-header fixed-top">
      <FaArrowLeft className="back-arrow" onClick={handleBack} />
      <h1 className="header">Order History</h1>
         {/* Filter Dropdown */}
         <div className="filter-container">
          {/* <label htmlFor="filter">Show: </label> */}
          <select id="filter" value={filter} onChange={handleFilterChange} style={{borderRadius: "1rem"}}>
            <option value="Today">Today</option>
            <option value="Previous">Previous</option>
          </select>
        </div>

      </div>
      <div className="history-container">

        {/* Grand Total Display */}
        <div className="grand-total">
          <h2 className="total-sale">{filter} Sales: ₹{grandTotal}</h2>
        </div>

        {filteredOrders.length > 0 ? (
          [...filteredOrders].reverse().map((order, index) => (
            
            <div key={order.id} className="order-section">
              <hr />
              <h2>
              Order {filteredOrders.length - index} - <span>{formatDate(order.timestamp)}</span>
              </h2>
              <p>
                <strong>Amount Received: ₹{order.totalAmount}</strong>{" "}
              </p>
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
          <p>No orders found for {filter.toLowerCase()}.</p>
        )}
      </div>
    </div>
  );
};

export default History;
