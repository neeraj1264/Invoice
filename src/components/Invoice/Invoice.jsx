import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Invoice.css";
import {
  FaMinusCircle,
  FaPlusCircle,
  FaArrowRight,
  FaArrowLeft,
  FaTimesCircle,
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsToSend, setProductsToSend] = useState([]);
  const navigate = useNavigate(); // For navigation

  // Load products from localStorage on component mount
  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    setSelectedProducts(products);

    const storedProductsToSend =
      JSON.parse(localStorage.getItem("productsToSend")) || [];
    setProductsToSend(storedProductsToSend);
  }, []);

  // Function to handle adding a product
  const handleAddToWhatsApp = (product) => {
    const updatedProductsToSend = [
      ...productsToSend,
      { ...product, quantity: 1 },
    ];
    setProductsToSend(updatedProductsToSend);
    localStorage.setItem(
      "productsToSend",
      JSON.stringify(updatedProductsToSend)
    );
  };

  const handleQuantityChange = (productName, delta) => {
    const updatedProductsToSend = productsToSend
      .map((prod) => {
        if (prod.name === productName) {
          const newQuantity = prod.quantity + delta;
          if (newQuantity < 1) {
            return null;
          }
          return { ...prod, quantity: newQuantity };
        }
        return prod;
      })
      .filter(Boolean);

    setProductsToSend(updatedProductsToSend);
    localStorage.setItem(
      "productsToSend",
      JSON.stringify(updatedProductsToSend)
    );
  };

  const handleRemoveProduct = (productName) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (prod) => prod.name !== productName
    );
    const updatedProductsToSend = productsToSend.filter(
      (prod) => prod.name !== productName
    );

    setSelectedProducts(updatedSelectedProducts);
    setProductsToSend(updatedProductsToSend);

    localStorage.setItem("products", JSON.stringify(updatedSelectedProducts));
    localStorage.setItem(
      "productsToSend",
      JSON.stringify(updatedProductsToSend)
    );
  };

  const calculateTotalPrice = () => {
    return productsToSend.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 20); // Base fee ₹20
  };

  const handleDone = () => {
    localStorage.setItem("selectedProducts", JSON.stringify(productsToSend));
    localStorage.setItem("totalAmount", calculateTotalPrice());
    navigate("/customer-detail");
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Function to generate PDF
  const generatePDF = () => {
    const input = document.getElementById("invoiceContent");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Width of the image on PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div>
      <FaArrowLeft className="back-arrow" onClick={() => handleBack()} />
      <h1 className="invoice-header">Invoice Page</h1>
      <div id="invoiceContent" style={{ marginTop: "3rem" }}>
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product, index) => (
            <div key={index}>
              <div className="main-box">
                <div className="img-box">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "3rem", height: "3rem" }}
                    />
                  ) : (
                    <FaImage style={{ width: "3rem", height: "3rem" }} />
                  )}
                </div>

                <div className="sub-box">
                  <h3>
                    {product.name} ~ {product.size}
                  </h3>
                  <p style={{ color: "grey", fontWeight: 700 }}>
                    Price:{" "}
                    <span style={{ color: "black", fontWeight: 800 }}>
                      ₹ {product.price}
                    </span>{" "}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => handleRemoveProduct(product.name)}
                  style={{ cursor: "pointer", color: "red", fontSize: "1.5rem" }}
                >
                  <FaTimesCircle />
                </button>

                {productsToSend.some((prod) => prod.name === product.name) ? (
                  <div className="quantity-btns">
                    <button
                      className="icons"
                      onClick={() => handleQuantityChange(product.name, -1)}
                    >
                      <FaMinusCircle />
                    </button>
                    <span style={{ margin: "0 .4rem" }}>
                      {productsToSend.find((prod) => prod.name === product.name)
                        ?.quantity || 1}
                    </span>
                    <button
                      className="icons"
                      onClick={() => handleQuantityChange(product.name, 1)}
                    >
                      <FaPlusCircle />
                    </button>
                  </div>
                ) : (
                  <div className="btn-box">
                    <button
                      onClick={() => handleAddToWhatsApp(product)}
                      className="add-btn"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No products selected</p>
        )}
      </div>
      <button onClick={handleDone} className="done">
        Next
        <FaArrowRight className="Invoice-arrow" />
      </button>

      {/* Button to generate the PDF */}
      <button onClick={generatePDF} className="pdf-btn">
        Download PDF
      </button>
    </div>
  );
};

export default Invoice;
