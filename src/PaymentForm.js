import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";

const PaymentForm = ({ stripe, onSubmit }) => {
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();

    const { token } = await stripe.createToken();

    onSubmit();

    dispatch({ type: "set-token", payload: token });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField required id="cardName" label="Name on card" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            Card details
            <CardNumberElement />
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            Expiration date
            <CardExpiryElement />
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            CVC
            <CardCVCElement />
          </label>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" type="submit">
        Next
      </Button>
    </form>
  );
};
export default injectStripe(PaymentForm);
