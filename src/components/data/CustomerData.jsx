import React, { useEffect, useState } from 'react';
import './CustomerData.css'; // Import the CSS file
import { fetchcustomerdata } from '../../api';

export const CustomerData = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCustomers = await fetchcustomerdata(); // Fetch from API
        setCustomers(storedCustomers);
      } catch (error) {
        console.error("Error fetching customer data:", error.message);
      }
    };
  
    fetchData();
  
    // Load localStorage customers as a fallback
    const localStorageCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    if (localStorageCustomers.length > 0) {
      setCustomers(localStorageCustomers);
    }
  }, []);  

  return (
    <div className="customer-data-container">
      <h2 className="heading">Customer Data</h2>
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
    </div>
  );
};
