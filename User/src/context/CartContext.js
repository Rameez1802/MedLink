import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 🔥 ALWAYS USE SAME ID FORMAT
  const getId = (item) =>
    item.id || `${item.name}_${item.pharmacy}`;

  // ✅ ADD
  const addToCart = (item) => {
  const id = `${item.name}_${item.pharmacy}`;

  setCart((prev) => {
    const exists = prev.find((i) => i.id === id);

    if (exists) {
      return prev.map((i) =>
        i.id === id
          ? { ...i, qty: i.qty + (item.qty || 1) } // 🔥 FIX
          : i
      );
    }

    return [...prev, { ...item, id, qty: item.qty || 1 }];
  });
};

  // ✅ REMOVE (ALWAYS WORKS)
  const removeFromCart = (itemToRemove) => {
  setCart((prev) => {
    return prev.filter((item) => {
      return item.id !== itemToRemove.id;
    });
  });
};

  // ✅ INCREASE
  const increaseQty = (item) => {
    const id = getId(item);

    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  // ✅ DECREASE
  const decreaseQty = (item) => {
  setCart((prev) => {
    return prev
      .map((i) =>
        i.id === item.id
          ? { ...i, qty: i.qty - 1 }
          : i
      )
      .filter((i) => i.qty > 0); // 🔥 REMOVE IF 0
  });
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};