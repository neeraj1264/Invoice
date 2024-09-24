// App.js
import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Catologue from "./components/catologue/Catologue";
import Invoice from "./components/Invoice/Invoice";
import "./App.css";
import CustomerDetail from "./components/CustomerDetail/CustomerDetail";
import InvoiceDisplay from "./components/CustomerDetail/InvoiceDisplay";
const App = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

   // Clear 'productsToSend' from localStorage on page reload
   useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("productsToSend");
    };

    // Set the event listener for page reload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Catologue setSelectedProducts={setSelectedProducts} />}
        />
        <Route
          path="/invoice"
          element={<Invoice selectedProducts={selectedProducts} />}
        />
        <Route path="/customer-detail" element={<CustomerDetail />} />
        <Route path="/invoice-display" element={<InvoiceDisplay />} />

      </Routes>
    </Router>
  );
};

export default App;
