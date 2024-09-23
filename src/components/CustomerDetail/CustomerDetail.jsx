import React, { useState, useEffect } from "react";
import './Customer.css';
import { FaArrowLeft , FaArrowRight} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CustomerDetail = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pdfMake, setPdfMake] = useState(null); // Store pdfMake in state
  const navigate = useNavigate(); // For navigation

  
  useEffect(() => {
    // Dynamically import pdfMake and vfs_fonts
    const loadPdfMake = async () => {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      pdfMakeModule.default.vfs = pdfFontsModule.default.pdfMake.vfs;

      setPdfMake(pdfMakeModule.default); // Store the imported pdfMake module in state
    };

    loadPdfMake();
  }, []);

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

  const handleSendClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDownloadPDF = () => {
    if (!pdfMake) {
      alert("PDF generation tools coming soon");
      return;
    }
  
    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const totalAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;
    const itemTotal = selectedProducts.reduce(
      (sum, product) => sum + product.price * (product.quantity || 1),
      0
    );
  
    const content = `
    <h1 class="header">Foodies Hub</h1>
  <p class="headerr">Pehowa, Haryana, 136128</p>
  <p class="headerr">Phone Number - +91 70158-23645</p>
  <h3 class="subheader">Invoice Details</h3>
  <p class="customerinfo">Customer Name   -  ${customerName}</p>
  <p class="customerinfo">Address         -  ${customerAddress}</p>
  <p class="customerinfo">Phone Number    -  ${customerPhone}</p>

      <table border="1" style="width: 100%; text-align: center;">
        <thead>
          <tr><th>Product Name</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${selectedProducts
            .map(
              (product) => `
              <tr>
                <td>${product.size ? `${product.name} (${product.size})` : product.name}</td>
                <td>${product.quantity || 1}</td>
                <td>₹${product.price}</td>
                <td>₹${(product.price * (product.quantity || 1)).toFixed(2)}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <p class="total">Item Total: ₹${itemTotal.toFixed(2)}</p>
      <p class="totall">Service Charge: ₹20.00</p>
      <p class="totall">Total Amount: ₹${totalAmount.toFixed(2)}</p>
    `;
  
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    document.body.appendChild(tempDiv); // Append to body
  
    html2canvas(tempDiv).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 250);
      pdf.save('invoice.pdf');
      document.body.removeChild(tempDiv); // Clean up
    });
  };
  

  const handleBack = () => {
    navigate(-1);
};
  return (
    <div>
      <FaArrowLeft className="back-arrow" onClick={()=> handleBack()}/>
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
          placeholder="customer phone..."
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
            <button onClick={handleDownloadPDF} style={styles.popupButton}>
              Download PDF
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

// Simple inline styles for modal and buttons
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
