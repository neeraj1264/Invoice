import React, { useState, useEffect } from "react";
import "./History.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [filter, setFilter] = useState("Today");
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const todayOrders = savedOrders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= startOfToday;
    });

    const previousOrders = savedOrders.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate < startOfToday;
    });

    setFilteredOrders(filter === "Today" ? todayOrders : previousOrders);

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

    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    const hours = orderDate.getHours();
    const minutes = orderDate.getMinutes();
    const isPM = hours >= 12;
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes > 9 ? minutes : `0${minutes}`;
    const period = isPM ? "PM" : "AM";
    const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

    if (orderDate >= startOfToday) {
      return `Today at ${formattedTime}`;
    } else if (orderDate >= startOfYesterday && orderDate < startOfToday) {
      return `Yesterday at ${formattedTime}`;
    } else {
      return `${formattedTime}`;
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div>
      <div className="history-header fixed-top">
        <FaArrowLeft className="back-arrow" onClick={handleBack} />
        <h1 className="header">Order History</h1>
        <div className="filter-container">
          <select id="filter" value={filter} onChange={handleFilterChange} style={{ borderRadius: "1rem" }}>
            <option value="Today">Today</option>
            <option value="Previous">Previous</option>
          </select>
        </div>
      </div>
      <div className="history-container">
        <div className="grand-total">
          <h2 className="total-sale">{filter} Sales: ₹{grandTotal}</h2>
        </div>

        {filteredOrders.length > 0 ? (
          [...filteredOrders].reverse().map((order, index) => (
            <div key={order.id} className="order-section">
              <hr />
              <h2 onClick={() => toggleOrder(order.id)} style={{ cursor: "pointer" }}>
                Order {filteredOrders.length - index} - <span>{formatDate(order.timestamp)}</span>
              </h2>
              <p>
                <strong>Amount Received: ₹{order.totalAmount}</strong>{" "}
              </p>
              {expandedOrderId === order.id && ( // Render table only if this order is expanded
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
              )}
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
