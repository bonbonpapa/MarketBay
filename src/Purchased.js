import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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

export default function Purchased() {
  const classes = useStyles();

  let [orders, setOrders] = useState([]);
  let username = useSelector(state => state.username);
  console.log("username in Purchased function components", username);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/get-orders?username=" + username);
      let body = await res.text();
      body = JSON.parse(body);
      console.log("Body returned from server", body);
      if (body.success) {
        setOrders(body.data);
      }
    }
    fetchData();
  }, [setOrders]);

  // const shoppingHistory = useSelector(state => state.shoppingHistory);

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          <List disablePadding>
            {orders.map(product => (
              <ListItem className={classes.listItem} key={product._id}>
                <ListItemText primary={product._id} />
                <Typography variant="body2">{product.username}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </main>
    </React.Fragment>
  );
}
