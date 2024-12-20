import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "./Invoice.css";
import {
  FaMinusCircle,
  FaPlusCircle,
  FaArrowRight,
  FaBars,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
// import { AiOutlineBars } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";
import Header from "../header/Header";

const Invoice = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productsToSend, setProductsToSend] = useState([]);
  const [Search, setSearch] = useState(""); // State for search query
  const [showPopup, setShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [selectedVariety, setSelectedVariety] = useState([]);

  const navigate = useNavigate(); // For navigation

  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  let pressTimer;

  const handlePressStart = () => {
    // Set a timeout to show the remove button after 1 second (1000 ms)
    pressTimer = setTimeout(() => {
      setShowRemoveBtn(true);
    }, 1000);
  };

  const handlePressEnd = () => {
    // Clear the timeout if the user releases the press before 1 second
    clearTimeout(pressTimer);
  };

  const filteredProducts = selectedProducts
    .filter((product) =>
      product.name.toLowerCase().includes(Search.toLowerCase())
    )
    .reduce((acc, product) => {
      const category = product.category || "Others";

      // Ensure the category key exists in the accumulator
      if (!acc[category]) {
        acc[category] = [];
      }

      // Add the product to the correct category group
      acc[category].push(product);

      return acc;
    }, {});

  // Load products from localStorage on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://invoice-5vnp09gr.b4a.run/api/products"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log("Fetched products:", data);
        setSelectedProducts(data); // Set fetched products to state
      } catch (error) {
        console.error("Error fetching products:", error.message); // Logs the error message
      }
    };

    fetchProducts();

    const storedProductsToSend =
      JSON.parse(localStorage.getItem("productsToSend")) || [];
    setProductsToSend(storedProductsToSend);
  }, []);

  const handleOpenPopup = (product) => {
    if (product.varieties && product.varieties.length > 0) {
      setCurrentProduct(product);
      setShowPopup(true);
    } else {
      handleAddToWhatsApp(product); // Directly add product if no varieties
    }
  };

  const handleVarietyQuantityChange = (variety, delta) => {
    setSelectedVariety((prev) => {
      let updatedVarieties = prev.map((selected) =>
        selected.size === variety.size && selected.price === variety.price
          ? { ...selected, quantity: selected.quantity + delta }
          : selected
      );

      // Remove variety if the quantity becomes less than 1
      updatedVarieties = updatedVarieties.filter(
        (selected) => selected.quantity > 0
      );

      // Save updated selectedVariety to localStorage
      // localStorage.setItem("selectedVariety", JSON.stringify(updatedVarieties));

      // Update productsToSend based on the updated selectedVarieties
      setProductsToSend((prevProducts) => {
        const updatedProducts = prevProducts
          .map((prod) => {
            if (
              prod.name === currentProduct.name &&
              prod.size === variety.size &&
              prod.price === variety.price
            ) {
              const newQuantity = prod.quantity + delta;

              // If quantity becomes less than 1, remove it
              if (newQuantity < 1) {
                return null; // Mark for removal
              }
              return { ...prod, quantity: newQuantity };
            }
            return prod;
          })
          .filter((prod) => prod !== null); // Remove null entries

        // Update localStorage with the updated productsToSend
        localStorage.setItem("productsToSend", JSON.stringify(updatedProducts));
        return updatedProducts;
      });

      return updatedVarieties;
    });
  };

  const handleVarietyChange = (variety, isChecked) => {
    setSelectedVariety((prev) => {
      let updatedVarieties;
      if (isChecked) {
        updatedVarieties = [
          ...prev,
          { ...variety, quantity: 1 }, // Default quantity for each selected variety
        ];
      } else {
        updatedVarieties = prev.filter(
          (selected) =>
            !(
              selected.size === variety.size && selected.price === variety.price
            )
        );
      }

      // Save updated selectedVariety to localStorage
      localStorage.setItem("selectedVariety", JSON.stringify(updatedVarieties));

      return updatedVarieties;
    });
  };

  const handleAddToWhatsApp = (product, selectedVarieties = []) => {
    // Handle products with no varieties
    if (selectedVarieties.length === 0) {
      const exists = productsToSend.some(
        (prod) =>
          prod.name === product.name &&
          prod.price === product.price &&
          prod.size === product.size
      );

      if (!exists) {
        // Add the product if it doesn't already exist
        setProductsToSend((prev) => {
          const updatedProducts = [...prev, { ...product, quantity: 1 }];
          // Update localStorage after setting the state
          localStorage.setItem(
            "productsToSend",
            JSON.stringify(updatedProducts)
          );
          return updatedProducts;
        });
      } else {
        // Update quantity if the product already exists
        setProductsToSend((prev) => {
          const updatedProducts = prev.map((prod) =>
            prod.name === product.name &&
            prod.price === product.price &&
            prod.size === product.size
              ? { ...prod, quantity: prod.quantity + 1 }
              : prod
          );
          // Update localStorage after setting the state
          localStorage.setItem(
            "productsToSend",
            JSON.stringify(updatedProducts)
          );
          return updatedProducts;
        });
      }
      return;
    }

    // Handle products with selected varieties
    const newProducts = selectedVarieties.map((variety) => ({
      ...product,
      ...variety,
      quantity: variety.quantity || 1, // Default quantity for each variety
    }));

    setProductsToSend((prev) => {
      let updatedProductsToSend = [...prev];

      newProducts.forEach((newProduct) => {
        const exists = updatedProductsToSend.some(
          (prod) =>
            prod.name === newProduct.name &&
            prod.price === newProduct.price &&
            prod.size === newProduct.size
        );

        if (!exists) {
          updatedProductsToSend.push(newProduct);
        } else {
          updatedProductsToSend = updatedProductsToSend.map((prod) =>
            prod.name === newProduct.name &&
            prod.price === newProduct.price &&
            prod.size === newProduct.size
              ? { ...prod, quantity: prod.quantity + 1 }
              : prod
          );
        }
      });

      // Update localStorage after state update
      localStorage.setItem(
        "productsToSend",
        JSON.stringify(updatedProductsToSend)
      );

      return updatedProductsToSend;
    });

    setShowPopup(false); // Close popup
    setSelectedVariety([]); // Reset selected varieties
  };

  // Function to handle quantity changes
  const handleQuantityChange = (productName, productPrice, delta) => {
    const updatedProductsToSend = productsToSend
      .map((prod) => {
        if (prod.name === productName && prod.price === productPrice) {
          const newQuantity = prod.quantity + delta;
          if (newQuantity < 1) {
            return null; // Remove the product if quantity goes below 1
          }
          return { ...prod, quantity: newQuantity };
        }
        return prod;
      })
      .filter(Boolean); // Remove any null values

    setProductsToSend(updatedProductsToSend);
    localStorage.setItem(
      "productsToSend",
      JSON.stringify(updatedProductsToSend)
    );
  };

  // Function to remove a product from selected products and productsToSend
  const handleRemoveProduct = async (productName, productPrice) => {
    try {
      // Send DELETE request to your backend API to delete the product from MongoDB
      const response = await fetch(
        "https://invoice-5vnp09gr.b4a.run/api/products",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: productName, price: productPrice }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove product from database");
      }

      // Remove product from the selectedProducts and productsToSend arrays
      const updatedSelectedProducts = selectedProducts.filter(
        (prod) => !(prod.name === productName && prod.price === productPrice)
      );
      const updatedProductsToSend = productsToSend.filter(
        (prod) => !(prod.name === productName && prod.price === productPrice)
      );

      // Update the state
      setSelectedProducts(updatedSelectedProducts);
      setProductsToSend(updatedProductsToSend);

      // Update localStorage
      localStorage.setItem("products", JSON.stringify(updatedSelectedProducts));
      localStorage.setItem(
        "productsToSend",
        JSON.stringify(updatedProductsToSend)
      );

      console.log("Product removed successfully from both MongoDB and state");
    } catch (error) {
      console.error("Error removing product:", error.message);
    }
  };

  // Navigate to the customer details page
  const handleDone = () => {
    if (productsToSend.length === 0) {
      alert("Please add at least one product before proceeding.");
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
    <div>
      <Header headerName="Invoice" setSearch={setSearch} />

      {/* Add a search input to filter products */}

      <div className="main">
        {Object.keys(filteredProducts).length > 0 ? (
          Object.keys(filteredProducts)
            .sort((a, b) => a.localeCompare(b)) // Sort category names alphabetically
            .map((category, index) => (
              <React.Fragment key={index}>
                <h2 className="category">{category}</h2>
                {filteredProducts[category].map((product, idx) => (
                  <div key={idx} className="main-box">
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

                    <div
                      className="sub-box"
                      onMouseDown={handlePressStart}
                      onMouseUp={handlePressEnd}
                      onTouchStart={handlePressStart}
                      onTouchEnd={handlePressEnd}
                    >
                      <h3 className="p-name">
                        {product.name}
                        {product.varieties &&
                        Array.isArray(product.varieties) &&
                        product.varieties[0]?.size
                          ? ` (${product.varieties[0].size})`
                          : ""}
                      </h3>
                      <p style={{ color: "grey", fontWeight: 700 }}>
                        Price:{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: 800,
                            fontFamily: "Noto Sans Roboto Arial",
                          }}
                        >
                          ₹{" "}
                          {product.price
                            ? product.price // Use product price if it exists
                            : product.varieties.length > 0
                            ? product.varieties[0].price // Fallback to first variety price
                            : "N/A"}{" "}
                          {/* Handle case when neither price nor varieties are available */}
                        </span>
                        {showRemoveBtn && (
                          <span
                            className="remove-btn"
                            onClick={() =>
                              handleRemoveProduct(product.name, product.price)
                            }
                          >
                            <FaTimesCircle />
                          </span>
                        )}
                      </p>
                    </div>

                    {productsToSend.some(
                      (prod) =>
                        prod.name === product.name &&
                        prod.price === product.price
                    ) ? (
                      <div className="quantity-btns">
                        <button
                          className="icons"
                          onClick={() =>
                            handleQuantityChange(
                              product.name,
                              product.price,
                              -1
                            )
                          }
                        >
                          <FaMinusCircle />
                        </button>
                        <span style={{ margin: "0 .4rem" }}>
                          {productsToSend.find(
                            (prod) =>
                              prod.name === product.name &&
                              prod.price === product.price
                          )?.quantity || 1}
                        </span>
                        <button
                          className="icons"
                          onClick={() =>
                            handleQuantityChange(product.name, product.price, 1)
                          }
                        >
                          <FaPlusCircle />
                        </button>
                      </div>
                    ) : (
                      <div className="btn-box">
                        <button
                          onClick={() => handleOpenPopup(product)}
                          className="add-btn"
                        >
                          Add
                        </button>
                        {product.varieties?.length > 0 && (
                          <span className="customise-text">Customise</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <hr />
              </React.Fragment>
            ))
        ) : (
          <p
            style={{
              textAlign: "center",
              position: "absolute",
              top: "48%",
              left: "30%",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#3c60fd",
            }}
          >
            Loading...
          </p>
        )}
      </div>

      <div className="invoice-btn">
        <button onClick={() => navigate("/NewProduct")}>+ Product</button>

        <button onClick={handleDone}>
          Next
          <FaArrowRight className="Invoice-arrow" />
        </button>
      </div>
      {showPopup && currentProduct && currentProduct.varieties?.length > 0 && (
        <div className="popup-overlay">
          <div className="popup-content">
            <FaTimesCircle
              className="close-icon"
              onClick={() => setShowPopup(false)}
            />
            <h3>Select Varieties for {currentProduct.name}</h3>
            {currentProduct.varieties.map((variety, index) => (
              <div key={index} className="variety-option">
                <label className="variety-label">
                  <input
                    type="checkbox"
                    name="variety"
                    value={index}
                    checked={selectedVariety.some(
                      (v) =>
                        v.size === variety.size && v.price === variety.price
                    )}
                    onChange={(e) =>
                      handleVarietyChange(variety, e.target.checked)
                    }
                  />
                  <span>
                    {variety.size.charAt(0).toUpperCase()} ~ ₹ {variety.price}
                  </span>
                </label>

                {selectedVariety.some(
                  (v) => v.size === variety.size && v.price === variety.price
                ) && (
                  <div className="quantity-buttons">
                    <button
                      onClick={() => handleVarietyQuantityChange(variety, -1)}
                      disabled={variety.quantity <= 1}
                    >
                      <FaMinusCircle />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={
                        selectedVariety.find(
                          (v) =>
                            v.size === variety.size && v.price === variety.price
                        )?.quantity || 1
                      }
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value, 10);
                        handleVarietyQuantityChange(
                          variety,
                          quantity - variety.quantity
                        );
                      }}
                    />
                    <button
                      onClick={() => handleVarietyQuantityChange(variety, 1)}
                    >
                      <FaPlusCircle />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() =>
                handleAddToWhatsApp(currentProduct, selectedVariety)
              }
              disabled={selectedVariety?.length === 0}
              className="save-btn"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;
