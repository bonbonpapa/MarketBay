import React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm.jsx";

const Checkout = ({ amount }) => {
  return (
    <StripeProvider apiKey="pk_test_Od1JbkgXOi6lpyatgG3KaT8Z00pBw8C5ry">
      <Elements>
        <CheckoutForm amount={amount} />
      </Elements>
    </StripeProvider>
  );
};

export default Checkout;
