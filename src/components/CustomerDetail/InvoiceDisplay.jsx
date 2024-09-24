import React from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import logoBase64 from "./logo";
import "./InvoiceDisplay.css";

const InvoiceDisplay = () => {
  const location = useLocation();
  const { customerName, customerPhone, customerAddress, selectedProducts = [], totalAmount = 0 } = location.state || {};

  const itemTotal = selectedProducts.reduce(
    (sum, product) => sum + product.price * (product.quantity || 1),
    0
  );

  const handleScreenshot = () => {
    const invoice = document.getElementById("invoice");
    html2canvas(invoice).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "invoice.png";
      link.click();
    });
  };

  return (
    <div className="invoice-content" id="invoice">
      <img src="logo.png" alt="Logo" width={100} />
      <h1 style={{textAlign: "center" , margin: 0 , fontSize: "1.4rem" }}>Foodies Hub</h1>
      <p style={{textAlign: "center" , margin: 0 , fontSize: "1rem" }}>Pehowa, Haryana, 136128</p>
      <p style={{textAlign: "center" , margin: 0 , fontSize: "1rem" }}>Phone Number - +91 70158-23645</p>
      <hr />
      <h2  style={{textAlign: "center" , margin: 0}}>Invoice Details</h2>
      <div className="customer-info">
      <p style={{marginLeft: ".8rem"}}>Customer Name &nbsp;&nbsp;&nbsp;&nbsp;- &nbsp;&nbsp;&nbsp;&nbsp;{customerName}</p>
      <p style={{marginLeft: ".8rem"}}>Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{customerAddress}</p>
      <p style={{marginLeft: ".8rem"}}>Phone Number &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;&nbsp;{customerPhone}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{textAlign: "left"}}>Product Name</th>
            <th style={{textAlign: "left"}}>Quantity</th>
            <th style={{textAlign: "left"}}>Price</th>
            <th style={{textAlign: "left"}}>Total</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.size ? `${product.name} (${product.size})` : product.name}</td>
              <td style={{textAlign: "Center"}}>{product.quantity || 1}</td>
              <td>₹{product.price}</td>
              <td>₹{(product.price * (product.quantity || 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
      <p>Item Total: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹{itemTotal.toFixed(2)}</p>
      <p>Service Charge: &nbsp;₹20.00</p>
      <p>Total Amount:&nbsp; ₹{totalAmount.toFixed(2)}</p>
      </div>
      <button onClick={handleScreenshot} className="download-button">
        Download Invoice
      </button>
    </div>
  );
};

export default InvoiceDisplay;
