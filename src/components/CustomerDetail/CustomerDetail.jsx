// CustomerDetail.js
import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { handleScreenshot } from "./utils"; // Import the function
import "./Customer.css";

const CustomerDetail = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const invoiceRef = useRef(); // Reference to the hidden invoice content
  const navigate = useNavigate();

  useEffect(() => {
    // Load selected products and total amount from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const storedAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;

    setSelectedProducts(storedProducts);
    setTotalAmount(storedAmount);
  }, []);

  const handleSendToWhatsApp = () => {
    const productDetails = selectedProducts
      .map(
        (product) =>
          `${product.quantity || 1}.0 x ${product.name}  ${product.size} = ₹${product.price * (product.quantity || 1)}`
      )
      .join("\n");

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const message = encodeURIComponent(
      `Order: *${orderId}*\nPhone: *${customerPhone}*\nName: *${customerName}*\nAmount: *₹${totalAmount}*\nAddress: *${customerAddress}*\n\n----------item----------\n${productDetails}\nService Charge = ₹20.00`
    );

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

  const handleDownloadInvoiceScreenshot = () => {
    // Show the hidden invoice, take the screenshot, and then hide it again
    invoiceRef.current.style.display = "block";
    // setTimeout(() => {
    //   handleScreenshot("invoice")
    //     invoiceRef.current.style.display = "none";
    // }, 100); 
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

      {/* Hidden Invoice Content */}
      <div className="invoice-content" id="invoice"  ref={invoiceRef}   style={{ display: "none" }} >
      <img src="logo.png" alt="Logo" width={100} />
      <h1 style={{textAlign: "center" , margin: 0 , fontSize: "1.4rem" }}>Foodies Hub</h1>
      <p style={{textAlign: "center" , margin: 0 , fontSize: "1rem" }}>Pehowa, Haryana, 136128</p>
      <p style={{textAlign: "center" , margin: 0 , fontSize: "1rem" }}>Phone Number - +91 70158-23645</p>
      <hr />
      <h2  style={{textAlign: "center" , margin: 0}}>Invoice Details</h2>
      <div className="customer-info">
      <p style={{marginLeft: ".8rem"}}>Customer Name &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;{customerName ? customerName : "Guest Customer"}</p>
      <p style={{marginLeft: ".8rem"}}>Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{customerAddress ? customerAddress : "...."}</p>
      <p style={{marginLeft: ".8rem"}}>Phone Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;&nbsp;{customerPhone ? customerPhone : "...."}</p>
      </div>
      <table>
        <thead>
          <tr className="productname">
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product, index) => (
            <tr key={index} className="productdetail">
              <td>{product.size ? `${product.name} (${product.size})` : product.name}</td>
              <td style={{textAlign: "Center"}}>{product.quantity || 1}</td>
              <td>₹{product.price}</td>
              <td>₹{(product.price * (product.quantity || 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
      <p>Item Total: <span>₹{selectedProducts.reduce((sum, product) => sum + product.price * (product.quantity || 1), 0).toFixed(2)}</span></p>
      <p>Service Charge: <span>₹20.00</span></p>
     
      </div>
      <p className="totalAmount">Total Amount&nbsp;₹{totalAmount}/-</p>
    </div>

      <button onClick={handleSendClick} className="done">
        Send <FaArrowRight className="Invoice-arrow" />
      </button>

      {/* Modal Popup */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h2>Select Action</h2>
            <button onClick={handleSendToWhatsApp} style={styles.popupButton}>
              Send to WhatsApp
            </button>
            <button onClick={handleDownloadInvoiceScreenshot} style={styles.popupButton}>
              Download Invoice
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
