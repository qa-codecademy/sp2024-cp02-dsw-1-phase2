import { CartItem } from "../interfaces/cart.item.interface";

// Add to Cart function
const addToCart = (product: CartItem) => {
  const savedCart = localStorage.getItem("cart");
  let cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

  const existingProductIndex = cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex > -1) {
    // If the product is already in the cart, increment the quantity
    cartItems[existingProductIndex].quantity += product.quantity;
  } else {
    // If the product is not in the cart, add it with the specified quantity
    cartItems.push(product);
  }

  // Save the updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cartItems));

  // Dispatch a custom event to notify other components that the cart has been updated
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartItems }));

  // Return the updated cart for state synchronization if needed
  return cartItems;
};

export default addToCart;
