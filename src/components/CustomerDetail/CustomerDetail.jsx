import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import './Customer.css';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CustomerDetail = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

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
    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    const totalAmount = parseFloat(localStorage.getItem("totalAmount")) || 0;
    const itemTotal = selectedProducts.reduce(
      (sum, product) => sum + product.price * (product.quantity || 1),
      0
    );

    const tableBody = [
      ["Product Name", "Quantity", "Price", "Total"],
      ...selectedProducts.map((product) => [
        product.name,
        product.quantity || 1,
        `₹${product.price}`,
        `₹${(product.price * (product.quantity || 1)).toFixed(2)}`,
      ]),
    ];

    const docDefinition = {
      content: [
        { text: "Foodies Hub", style: "header" },
        { text: `Pehowa, Haryana, 136128`, style: "headerr" },
        { text: `Phone Number - +91 70158-23645`, style: "headerr" },
        {
          canvas: [{ type: "line", x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 2 }],
          margin: [0, 20],
        },
        { text: "Invoice Details", style: "subheader" },
        { text: `Customer Name   -     ${customerName}`, style: "customerInfo" },
        { text: `Address                 -     ${customerAddress}`, style: "customerInfo" },
        { text: `Phone Number     -     ${customerPhone}`, style: "customerInfoWithSpace" },
        {
          table: {
            widths: ["*", "auto", "auto", "auto"],
            headerRows: 1,
            body: tableBody,
          },
          style: "tableStyle",
        },
        { text: `Item Total:          ₹ ${itemTotal.toFixed(2)}`, style: "total" },
        { text: `Service Charge:   ₹ 20.00`, style: "totall" },
        { text: `Total Amount:    ₹ ${totalAmount.toFixed(2)}`, style: "totall" },
      ],
      styles: {
        header: {
          fontSize: 35,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        headerr: {
          fontSize: 25,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 25,
          bold: true,
          alignment: "center",
          margin: [0, 10, 0, 5],
        },
        total: {
          fontSize: 25,
          bold: true,
          alignment: "right",
          margin: [0, 60, 0, 0],
        },
        totall: {
          fontSize: 25,
          bold: true,
          alignment: "right",
          margin: [0, 10, 0, 0],
        },
        tableStyle: {
          fontSize: 15,
        },
        customerInfo: {
          fontSize: 20,
          alignment: "left",
          margin: [0, 10, 0, 0],
        },
        customerInfoWithSpace: {
          fontSize: 20,
          alignment: "left",
          margin: [0, 10, 0, 20],
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download("invoice.pdf");
  };

  return (
    <div>
      <h1 className="Customer-header">Customer Details</h1>
      <div>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer name..."
        />
      </div>
      <div>
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="customer phone..."
        />
      </div>
      <div>
        <input
          type="text"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          placeholder="Customer address..."
        />
      </div>
      <button onClick={handleSendClick}>Send</button>

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
