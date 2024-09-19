// Invoice.js
import React from 'react';

const Invoice = ({ selectedProducts }) => {
  const sendToWhatsApp = () => {
    const productDetails = selectedProducts
      .map(
        (product) =>
          `Product: ${product.name}, Price: ${product.price}${
            product.mrp ? `, MRP: ${product.mrp}` : ''
          }${product.size ? `, Size: ${product.size}` : ''}`
      )
      .join('\n');

    const phoneNumber = '1234567890'; // Change this to the recipient's WhatsApp number
    const message = encodeURIComponent(productDetails);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div>
      <h1>Invoice Page</h1>
      {selectedProducts.length > 0 ? (
        selectedProducts.map((product, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            {/* Conditionally show the product image */}
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100px', height: '100px' }}
              />
            )}
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>

            {/* Conditionally render MRP and Size if they exist */}
            {product.mrp && <p>MRP: {product.mrp}</p>}
            {product.size && <p>Size: {product.size}</p>}
          </div>
        ))
      ) : (
        <p>No products selected</p>
      )}
      <button onClick={sendToWhatsApp}>Done</button>
    </div>
  );
};

export default Invoice;
