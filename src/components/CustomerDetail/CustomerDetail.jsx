import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Customer.css";
import InvoiceDisplay from "./InvoiceDisplay"; // Import the new component

const CustomerDetail = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // const handleDownloadPDF = () => {
  //   const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
  //   const totalAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;

  //   navigate("/invoice-display", { state: { customerName, customerPhone, customerAddress, selectedProducts, totalAmount } });
  // };

  const handleSendToWhatsApp = () => {
    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const totalAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;

    const productDetails = selectedProducts
      .map(
        (product) =>
          `${product.quantity || 1}.0 x ${product.name}  ${product.size} = ₹${product.price * (product.quantity || 1)}`
      )
      .join("\n");

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const message = encodeURIComponent(`
Order      : *${orderId}*
Phone     : *${customerPhone}*
Name      : *${customerName}*
Amount   : *₹${totalAmount}*
Address  : *${customerAddress}*\n
----------item----------\n
${productDetails}
Service Charge = ₹20.00
    `);

    const phoneNumber = customerPhone;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleSendClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleNavigateToInvoice = () => {
    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const totalAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;

    navigate("/invoice-display", {
      state: {
        customerName,
        customerPhone,
        customerAddress,
        selectedProducts,
        totalAmount
      }
    });
  };

  return (
    <div>
      <FaArrowLeft className="back-arrow" onClick={handleBack} />
      <h1 className="Customer-header">Customer Details</h1>
      <div className="cust-inputs">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name..."
        />
      </div>
      <div className="cust-inputs">
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Customer phone..."
        />
      </div>
      <div className="cust-inputs">
        <input
          type="text"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          placeholder="Customer address..."
        />
      </div>
      <button onClick={handleSendClick} className="done">Send <FaArrowRight className="Invoice-arrow" /></button>

      
      {/* Modal Popup */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h2>Select Action</h2>
            <button onClick={handleSendToWhatsApp} style={styles.popupButton}>
              Send to WhatsApp
            </button>
            <button onClick={handleNavigateToInvoice} style={styles.popupButton}>
              Download invoice
            </button>
            <button onClick={handleClosePopup} style={styles.popupCloseButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
  },
  popupButton: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  popupCloseButton: {
    marginTop: "10px",
    backgroundColor: "red",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CustomerDetail;
