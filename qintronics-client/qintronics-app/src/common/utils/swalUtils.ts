import { NavigateFunction } from "react-router-dom";
import Swal from "sweetalert2";

const confirmationStyles: string =
  "mt-2 bg-[#1A3F6B] text-white font-bold p4 rounded-lg mx-auto shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center uppercase";

export const notLoggedFavoriteProduct = (navigate: NavigateFunction) => {
  Swal.fire({
    title: "Oops!",
    text: "Looks like you need to log in to make a wishlist — time to join the fun!",
    showCloseButton: true,
    confirmButtonText: "Log In",
    customClass: {
      confirmButton: confirmationStyles,
      title: "font-semibold text-[#1A3F6B]",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/login");
    }
  });
};

export const contactPageSuccess = (navigate: NavigateFunction) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Message sent successfully! Thank you!",
    confirmButtonText: "Return to Home",
    showCloseButton: false,
    customClass: {
      confirmButton: confirmationStyles,
      title: "text-[#1A3F6B]",
    },
  }).then(() => {
    navigate("/");
  });
};

export const giftCardComplete = (navigate: NavigateFunction) => {
  Swal.fire({
    title: "Added to Cart!",
    text: "Your gift card has been added to cart!",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    showCloseButton: false,
    customClass: {
      title: "text-[#1A3F6B]",
    },
  }).then(() => {
    navigate("/category/gift-cards");
  });
};

export const orderFormIncomplete = () => {
  Swal.fire({
    icon: "error",
    title: "Incomplete Form",
    text: "Please complete the checkout form before confirming the order.",
    customClass: {
      confirmButton: confirmationStyles,
      title: "text-[#1A3F6B]",
    },
  });
};

export const orderConfirm = (navigate: NavigateFunction) => {
  Swal.fire({
    icon: "success",
    title: "Order Confirmed!",
    text: "Your order has been successfully placed. Thank you!",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: {
      title: "text-[#1A3F6B]",
    },
  }).then(() => {
    navigate("/");
  });
};

export const invalidCardNumber = () => {
  Swal.fire({
    title: "Invalid Card Number",
    text: "Please enter a valid card number.",
    icon: "error",
    customClass: {
      confirmButton: confirmationStyles,
      title: "text-[#1A3F6B]",
    },
  });
};

export const invalidExpiryMonth = () => {
  Swal.fire({
    title: "Invalid Expiry Month",
    text: "Please enter a valid expiry month (01-12).",
    icon: "error",
    customClass: {
      confirmButton: confirmationStyles,
      title: "text-[#1A3F6B]",
    },
  });
};

export const invalidExpiryDate = () => {
  Swal.fire({
    title: "Invalid Expiry Date",
    text: "The expiry date cannot be in the past.",
    icon: "error",
    customClass: {
      confirmButton: confirmationStyles,
      title: "text-[#1A3F6B]",
    },
  });
};

export const invalidExpiryYear = () => {
  Swal.fire({
    title: "Invalid Expiry Year",
    text: "Please enter a valid 2-digit expiry year.",
    icon: "error",
    customClass: {
      confirmButton: confirmationStyles,
      title: "text-[#1A3F6B]",
    },
  });
};

export const paymentSuccessful = (navigate: NavigateFunction) => {
  Swal.fire({
    icon: "success",
    title: "Payment Successful!",
    text: "Your payment has been processed successfully. Thank you!",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: {
      title: "text-[#1A3F6B]",
    },
  }).then(() => {
    navigate("/");
  });
};

export const selectedCart = (navigate: NavigateFunction) => {
  Swal.fire({
    icon: "success",
    title: "Payment Successful!",
    text: "Your payment has been processed successfully. Thank you!",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: {
      title: "text-[#1A3F6B]",
    },
  }).then(() => {
    navigate("/");
  });
};
