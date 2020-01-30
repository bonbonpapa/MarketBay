import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";

const useStyles = makeStyles(theme => ({
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
  listItem: {
    padding: theme.spacing(1, 0)
  },
  total: {
    fontWeight: "700"
  },
  title: {
    marginTop: theme.spacing(2)
  }
}));

export default function Cart() {
  const classes = useStyles();

  const [name, SetName] = useState("");
  const [price, SetPrice] = useState(0.0);

  const shoppingList = useSelector(state => state.shoppingList);

  async function handleToken(token) {
    console.log({ token });
    let product = {
      name,
      price
    };

    const response = await axios.post("/checkout", {
      token,
      product
    });
    const { status } = response.data;

    if (status === "success") {
      alert("Success! check emails for details!");
    } else {
      alert("Something went wrong!");
    }
  }

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Order summary
          </Typography>
          <List disablePadding>
            {shoppingList.map(product => (
              <ListItem className={classes.listItem} key={product.description}>
                <ListItemText primary={product.description} />
                <Typography variant="body2">{product.price}</Typography>
              </ListItem>
            ))}
            <ListItem className={classes.listItem}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" className={classes.total}>
                $34.06
              </Typography>
            </ListItem>
          </List>
          <div>
            <StripeCheckout
              stripeKey="pk_test_Od1JbkgXOi6lpyatgG3KaT8Z00pBw8C5ry"
              token={handleToken}
              billingAddress
              shippingAddress
              amount={34.06 * 100}
            />
          </div>
        </Paper>
      </main>
    </React.Fragment>
  );
}
