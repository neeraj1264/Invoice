import React, { useState, useEffect } from "react";
import "./History.css";
import { FaArrowLeft , FaWhatsapp} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../api";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [filter, setFilter] = useState("Today");
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

 useEffect(() => {
  const getOrders = async () => {
    setLoading(true); // Start loading
    try {
      const data = await fetchOrders(); // Call the API function

      setOrders(data);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today at midnight

      // Calculate start and end time for the selected day
      const daysAgo = getDaysAgo(filter);
      const startOfSelectedDay = new Date(today);
      startOfSelectedDay.setDate(today.getDate() - daysAgo);

      const endOfSelectedDay = new Date(startOfSelectedDay);
      endOfSelectedDay.setHours(23, 59, 59, 999);

      // Filter orders for the selected day
      const dayOrders = data.filter((order) => {
        const orderDate = new Date(order.timestamp);
        return orderDate >= startOfSelectedDay && orderDate <= endOfSelectedDay;
      });

      setFilteredOrders(dayOrders);

      // Calculate grand total for the day
      const total = dayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      setGrandTotal(total);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  getOrders();
}, [filter]);


  // Helper to get "days ago" count
  const getDaysAgo = (filterValue) => {
    switch (filterValue) {
      case "Today":
        return 0;
      case "Yesterday":
        return 1;
      default:
        return parseInt(filterValue.split(" ")[0]); // Extract '2' from '2 days ago'
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (isoString) => {
    const orderDate = new Date(isoString);
    const day = orderDate.getDate();
    const month = orderDate.toLocaleString("default", { month: "short" });
    const year = orderDate.getFullYear();
    const hours = orderDate.getHours() % 12 || 12;
    const minutes = orderDate.getMinutes().toString().padStart(2, "0");
    const period = orderDate.getHours() >= 12 ? "PM" : "AM";

    return `${month} ${day}, ${year} - ${hours}:${minutes} ${period}`;
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const handleWhatsappClick = (order) => {
    const customerPhoneNumber = order.phone; // Correct field to access phone number
    const message = `We hope you had a delightful order experience with us. Your feedback is incredibly valuable as we continue to enhance our services. How did you enjoy your meal? We’d love to hear your thoughts.\nTeam: Foodies Hub`;
    // Create the WhatsApp URL to send the message
    const whatsappUrl = `https://wa.me/+91${customerPhoneNumber}?text=${encodeURIComponent(message)}`;
  
    // Open WhatsApp with the message
    window.open(whatsappUrl, "_blank");
  };  
  
  return (
    <div>
      <div className="history-header fixed-top">
        <FaArrowLeft className="back-arrow" onClick={handleBack} />
        <h1 className="header">Order History</h1>
         {/* Show loading spinner when fetching */}
        <div className="filter-container">
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            style={{ borderRadius: "1rem" }}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            {[...Array(6)].map((_, i) => (
              <option key={i} value={`${i + 2} days ago`}>
                {i + 2} days ago
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
        ) : (
      <div className="history-container">
        <div className="grand-total">
          <h2 className="total-sale">
            {filter} Sales: ₹{grandTotal}
          </h2>
        </div>

        {filteredOrders.length > 0 ? (
          [...filteredOrders].reverse().map((order, index) => (
            <div key={order.id} className="order-section">
              <hr />
              <div onClick={() => toggleOrder(order.id)}>
              <h2
                style={{ cursor: "pointer", fontSize: "1rem" }}
              >
                Order {filteredOrders.length - index} -{" "}
                <span>{formatDate(order.timestamp)}</span>
              </h2>
              <p>
                <strong>Amount Received: ₹{order.totalAmount}</strong>{" "}
                {order.phone && (
    <FaWhatsapp className="whatsapp" onClick={() => handleWhatsappClick(order)} />
  )}              </p>
              </div>
             
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
                        <td>
                          {product.size
                            ? `${product.name} (${product.size})`
                            : product.name}
                        </td>
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
      )}
    </div>
  );
};

export default History;
