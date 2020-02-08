import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import AddressForm from "./AddressForm.js";
import PaymentForm from "./PaymentForm.js";
import Review from "./Review.js";
import { useSelector } from "react-redux";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}));

const steps = ["Shipping address", "Payment details", "Review your order"];

const StepCheckoutForm = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  // const [receiptUrl, setReceiptUrl] = useState("");
  const order = useSelector(state => state.order);

  // if (order) {
  //   setReceiptUrl(order.data.charge.receipt_url);
  // }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressForm onSubmit={handleNext} />;
      case 1:
        return <PaymentForm onSubmit={handleNext} />;
      case 2:
        return <Review onSubmit={handleNext} />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <div>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                {order ? (
                  <div>
                    <h2>Payment Successful!</h2>
                    <a href={order.data.charge.receipt_url}>View Receipt</a>
                    <Typography variant="subtitle1">Order number</Typography>
                  </div>
                ) : (
                  <div>
                    <h2>Payment failed!</h2>{" "}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}

                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classes.button}
                    >
                      Place order
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      type="button"
                      className={classes.button}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Paper>
        <Copyright />
      </main>
    </div>
  );
};
export default StepCheckoutForm;
