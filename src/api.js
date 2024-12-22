const BASE_URL = 'https://invoice-5vnp09gr.b4a.run/api';

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);
  return response.json();
};

export const addCategory = async (name) => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return response.json();
};

// New function to fetch products
export const fetchProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.json();
};

export const removeProduct = async (productName, productPrice) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: productName, price: productPrice }),
  });

  if (!response.ok) {
    throw new Error("Failed to remove product from database");
  }

  return response.json(); // Optional: Return the API response
};

export const addProduct = async (product) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to save the product");
  }

  return response.json(); // Return the saved product
};

export const sendorder = async (order) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error(`Failed to send order to the server ${response.statusText}`);
  }

  return response.json(); // Return the saved product
};

export const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
};
