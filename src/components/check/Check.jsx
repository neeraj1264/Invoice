import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import "./Check.css"; // Import CSS
import { useNavigate } from "react-router-dom";

function Check() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProducts = localStorage.getItem("productsToSend");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts)); // Parse and set state
    }
  }, []);

    const handleDone = () => {
      if (products.length === 0) {
        toast.error(
          "Please add at least one product before proceeding.",
          toastOptions
        );
        return; // Prevent navigation if no products are selected
      }
  
      navigate("/customer-detail"); // Navigate to customer detail page
    };

      // Helper function to calculate total price
  const calculateTotalPrice = (products = []) => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };


  return (
    <>
      <Header />
      <div className="check-container">
        {products.length > 0 ? (
            <>
          <ul className="product-list">
            <li className="product-item">
              <div style={{ width: "60%" }}>
                <span>Name</span>
              </div>
              <div style={{ width: "10%" , textAlign: "center" }}>
                <span>Qty</span>
              </div>
              <div style={{ width: "10%" , textAlign: "center" }}>
                <span>x</span>
              </div>
              <div style={{ width: "19%" , textAlign: "center" }}>
                <span>Price</span>
              </div>
            </li>
            {products.map((product, index) => (
              <li key={index} className="product-item">
                <div style={{ width: "60%" }}>
                  <span>{product.name}</span>
                </div>
                <div style={{ width: "10%" , textAlign: "center" }}>
                  <span>{product.quantity}</span>
                </div>{" "}
                <div style={{ width: "10%" , textAlign: "center" }}>
                  <span>x</span>
                </div>{" "}
                <div style={{ width: "19%" , textAlign: "center" }}>
                  <span>{product.price}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="invoice-btn">
        <button onClick={()=>{navigate("/invoice")}} className="invoice-kot-btn">
          <h2> BACK </h2>
        </button>

        <button onClick={handleDone} className="invoice-next-btn">
          <h2 >
            {" "}
            NEXT ₹{calculateTotalPrice(products).toFixed(2)}
          </h2>
          {/* <FaArrowRight className="Invoice-arrow" /> */}
        </button>
      </div>
         </>
        ) : (
          <p className="no-products">No products found </p>
        )}
      </div>
    </>
  );
}

export default Check;
