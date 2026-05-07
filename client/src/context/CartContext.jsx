import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    vendorId: null,
    subtotal: 0,
    deliveryCharge: 0,
    discount: 0,
    total: 0,
  });

  /**
   * Add item to cart
   */
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existingItem = prev.items.find((item) => item.id === product.id);

      let newItems;
      if (existingItem) {
        newItems = prev.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev.items, { ...product, quantity }];
      }

      return {
        ...prev,
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  }, []);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.id !== productId);
      return {
        ...prev,
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  }, []);

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      return {
        ...prev,
        items: newItems,
        subtotal: calculateSubtotal(newItems),
      };
    });
  }, [removeFromCart]);

  /**
   * Clear cart
   */
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      vendorId: null,
      subtotal: 0,
      deliveryCharge: 0,
      discount: 0,
      total: 0,
    });
  }, []);

  /**
   * Set delivery charge and update total
   */
  const setDeliveryCharge = useCallback((charge) => {
    setCart((prev) => ({
      ...prev,
      deliveryCharge: charge,
      total: prev.subtotal + charge - prev.discount,
    }));
  }, []);

  /**
   * Set discount and update total
   */
  const setDiscount = useCallback((discount) => {
    setCart((prev) => ({
      ...prev,
      discount,
      total: prev.subtotal + prev.deliveryCharge - discount,
    }));
  }, []);

  const value = {
    ...cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setDeliveryCharge,
    setDiscount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Helper function to calculate subtotal
 */
const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
