// CustomerDetail.js
import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { handleScreenshot } from "../Utils/DownloadPng"; // Import the function
import "./Customer.css";
import { handleScreenshotAsPDF } from "../Utils/DownloadPdf";

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
    const storedProducts =
      JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const storedAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;

    setSelectedProducts(storedProducts);
    setTotalAmount(storedAmount);
  }, []);

  const handleSendToWhatsApp = () => {
    const productDetails = selectedProducts
      .map(
        (product) =>
          `${product.quantity || 1}.0 x ${product.name}  ${product.size} = ₹${
            product.price * (product.quantity || 1)
          }`
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

  const handlePngDownload = () => {
    // Show the hidden invoice, take the screenshot, and then hide it again
    invoiceRef.current.style.display = "block";
    setTimeout(() => {
      handleScreenshot("invoice");
      invoiceRef.current.style.display = "none";
    }, 10);
  };

  const handlePdfDownload = () => {
    // Show the hidden invoice, take the screenshot, and then hide it again
    invoiceRef.current.style.display = "block";
    setTimeout(() => {
      handleScreenshotAsPDF("invoice");
      invoiceRef.current.style.display = "none";
    }, 10);
  };

  const handlePrintKOT = () => {
    const kotContent = document.getElementById("invoice").innerHTML; // Fetch KOT content
    const newWindow = window.open("", "", "width=600,height=400"); // Open a new window
    newWindow.document.write(`
      <html>
        <head>
          <title>KOT</title>
<style>

body {
  font-family: Arial, sans-serif;
  padding: 20px;
  
}
table {
  width: 100%;
  border-collapse: collapse; /* Ensures borders collapse */
  margin-top: 10px; /* Top margin similar to 'margin: [0, 10, 0, 0]' */
}

th,
td {
  border: 1px solid black; /* Add border to cells */
  padding: 8px; /* Padding for table cells */
  text-align: center; /* Center align for both headers and content */
}

td {
  text-align: left;
}
th {
  background-color: #f2f2f2; /* Optional: Add background color to header */
}

td:first-child {
  width: 100%; /* Corresponds to '*' in widths */
}

td:nth-child(2),
td:nth-child(3),
td:nth-child(4) {
  width: auto; /* Corresponds to 'auto' in widths */
}

.productname th {
  text-align: left;
  font-size: 15px;
  padding: 0.2rem;
}
.productdetail td {
  text-align: left;
  font-size: 15px;
  padding: 0.2rem;
}
.total {
  margin-top: 1rem;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}
.total p {
  margin: 0.5rem 0 0 0;
  display: flex;
  justify-content: space-between;
  text-align: right;
  font-size: 18px;
}
.total span {
  width: 20%;
}
.totalAmount {
  font-size: 22px;
  background: black;
  color: white;
  width: fit-content;
  margin: auto;
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  margin-top: 1rem;
}

.invoice-content {
  padding: 1rem;
}
.invoice-content img {
  height: 2rem;
  width: 2rem;
  display: flex;
  margin: auto;
}
  .logo{
   display: flex;
  margin: auto;
  }

</style>
        </head>
        <body>
          ${kotContent}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close(); 
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

      
      <div
        className="invoice-content"
        id="invoice"
        ref={invoiceRef}
        style={{ display: "none" }}
      >
        <img src="logo.png" alt="Logo" width={100} className="logo" />
        <h1 style={{ textAlign: "center", margin: 0, fontSize: "25px" }}>
          Foodies Hub
        </h1>
        <p style={{ textAlign: "center", margin: 0, fontSize: "15px" }}>
          Pehowa, Haryana, 136128
        </p>
        <p style={{ textAlign: "center", margin: 0, fontSize: "15px" }}>
          Phone Number - +91 70158-23645
        </p>
        <hr />
        <h2 style={{ textAlign: "center", margin: 0, fontSize: "20px" }}>
          Invoice Details
        </h2>
        <div className="customer-info">
          <p style={{ fontSize: "15px" }}>
            Customer Name &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;
            {customerName ? customerName : "Guest Customer"}
          </p>
          <p style={{ fontSize: "15px" }}>
            Phone Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -
            &nbsp;&nbsp;&nbsp;&nbsp;{customerPhone ? customerPhone : "...."}
          </p>
          <p style={{ fontSize: "15px" }}>
            Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {customerAddress ? customerAddress : "...."}
          </p>
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
                <td>
                  {product.size
                    ? `${product.name} (${product.size})`
                    : product.name}
                </td>
                <td style={{ textAlign: "Center" }}>{product.quantity || 1}</td>
                <td style={{ textAlign: "Center" }}>₹{product.price}</td>
                <td style={{ textAlign: "Center" }}>
                  ₹{product.price * (product.quantity || 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total">
          <p>
            Item Total:{" "}
            <span>
              ₹
              {selectedProducts
                .reduce(
                  (sum, product) =>
                    sum + product.price * (product.quantity || 1),
                  0
                )
                .toFixed(2)}
            </span>
          </p>
          <p>
            Service Charge: <span>₹20.00</span>
          </p>
        </div>
        <p className="totalAmount">Net Total &nbsp;₹{totalAmount}.00/-</p>
      </div>
      <button onClick={handleSendClick} className="done">
        Send <FaArrowRight className="Invoice-arrow" />
      </button>

      ;{/* Modal Popup */}
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupContent}>
            <h2>Select Action</h2>
            <button onClick={handleSendToWhatsApp} style={styles.popupButton}>
              Send to WhatsApp
            </button>
            <button onClick={handlePngDownload} style={styles.popupButton}>
              Download Invoice
            </button>
            <button onClick={handlePdfDownload} style={styles.popupButton}>
              Download as PDF
            </button>
            <button onClick={handlePrintKOT} style={styles.popupButton}>
              Download KOT
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
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CustomerDetail;
