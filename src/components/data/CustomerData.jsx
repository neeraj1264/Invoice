import React, { useEffect, useState } from 'react';
import './CustomerData.css'; // Import the CSS file
import { fetchcustomerdata } from '../../api';
import { FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const storedCustomers = await fetchcustomerdata(); // Fetch from API
        setCustomers(storedCustomers);
      } catch (error) {
        console.error("Error fetching customer data:", error.message);
      }  finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchData();
  
    // Load localStorage customers as a fallback
    const localStorageCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    if (localStorageCustomers.length > 0) {
      setCustomers(localStorageCustomers);
    }
  }, []);  

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
       <div className="history-header fixed-top">
            <FaArrowLeft className="back-arrow" onClick={handleBack} />
            <h1 className="header">Customer Data</h1>
            </div>
    <div className="customer-data-container">
      {loading ? (
        <div className="lds-ripple"><div></div><div></div></div>
        ) : (
          <>
      {customers.length === 0 ? (
        <p className="no-customers-message">No customers found.</p>
      ) : (
        <ul className="customer-list">
          {customers.map((customer, index) => (
            <li key={index} className="customer-item">
              <h3 className="customer-title">Customer {index + 1}</h3>
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Address:</strong> {customer.address}</p>
            </li>
          ))}
        </ul>
      )}
      </>
       )}
    </div>
    </>
  );
};
