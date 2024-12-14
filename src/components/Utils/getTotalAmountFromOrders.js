// utils.js or a separate file for utility functions
export const getTotalAmountFromOrders = (orders) => {
    if (orders.length > 0) {
      return orders[0].totalAmount + 20; // Add ₹20 service charge
    }
    return 0; // Return 0 if no orders are found
  };
  