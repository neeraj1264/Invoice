import React, { useEffect, useState } from 'react';
import './CustomerData.css'; // Import the CSS file

export const CustomerData = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
    setCustomers(storedCustomers);
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
              <p><strong>Products:</strong> {customer.products.join(', ')}</p>
              <p><strong>Total Amount:</strong> ${customer.totalAmount}</p>
              <p><strong>Timestamp:</strong> {customer.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
