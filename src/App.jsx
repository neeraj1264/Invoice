// App.js
import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Invoice from "./components/Invoice/Invoice";
import "./App.css";
import CustomerDetail from "./components/CustomerDetail/CustomerDetail";
import NewProduct from "./components/ProductAdded/NewProduct";
import History from "./components/history/History";
import { CustomerData } from "./components/data/CustomerData";
import BluetoothPrinter from "./components/BluetoothComponent/printer";


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
      <Route path="/" element={<Navigate to="/invoice" />} />

        <Route
          path="/NewProduct"
          element={<NewProduct setSelectedProducts={setSelectedProducts} />}
        />
        <Route
          path="/invoice"
          element={<Invoice selectedProducts={selectedProducts} />}
        />
        <Route path="/customer-detail" element={<CustomerDetail />} />
        <Route path="/customer-data" element={<CustomerData />} />
        <Route path="/printer" element={<BluetoothPrinter/>} />
        <Route path="/history" element={<History />} />


      </Routes>
    </Router>
  );
};

export default App;
