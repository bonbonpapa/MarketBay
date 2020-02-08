let express = require("express");
const stripe = require("stripe")("sk_test_rZR28FL1Dt5b68vcM0YzEHSt00dPZJ8Cxp");
const uuid = require("uuid/v4");
const cors = require("cors");
const multer = require("multer");
let upload = multer({
  dest: __dirname + "/uploads/"
});
let app = express();
const MongoDb = require("mongodb");
const MongoClient = MongoDb.MongoClient;
const ObjectID = MongoDb.ObjectID;
const cookieParser = require("cookie-parser");

let reloadMagic = require("./reload-magic.js");

let sessions = {};

app.use(cookieParser());
reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
app.use("/uploads", express.static("uploads"));
app.use(express.json());

let dbo = undefined;
let url =
  "mongodb+srv://bob:bobuse@cluster0-peipd.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  dbo = client.db("media-board");
});

// Your endpoints go after this line

app.get("/session", async (req, res) => {
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  if (user) {
    let cart = await getCart(user.userId);
    console.log("cart in fetch session", cart);
    return res.send(
      JSON.stringify({
        success: true,
        username: user.username,
        userId: user.userId,
        cart: cart
      })
    );
  }
  res.send(JSON.stringify({ success: false }));
});

let getCart = async userId => {
  console.log("userID to get cart", userId);
  let results = await dbo
    .collection("carts")
    .findOne({ userId: String(userId), state: "active" });
  console.log("search results for the carts", results);
  return results;
};
app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log("this is the body", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;

  dbo.collection("users").findOne({ username: username }, (err, user) => {
    if (err) {
      console.log("sign up error,", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user !== null) {
      res.send(JSON.stringify({ success: false, message: "username takend" }));
      return;
    }

    dbo
      .collection("users")
      .insertOne({ username: username, password: enteredPassword })
      .then(() => {
        login(req, res);
      });
  });
});

let login = (req, res) => {
  console.log("login", req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  dbo.collection("users").findOne({ username: username }, async (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    let uPwd = user.password;
    if (uPwd === enteredPassword) {
      console.log("Password matches");
      let sessionId = generateId();
      console.log("generated id", sessionId);
      sessions[sessionId] = { username: username, userId: user._id };
      res.cookie("sid", sessionId);
      console.log("user ID in login", user._id);

      let cart = await getCart(user._id);
      console.log("cart in Login", cart);

      res.send(JSON.stringify({ success: true, userId: user._id, cart: cart }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
};
app.post("/login", upload.none(), login);

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};
app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sid;
  delete sessions[sessionId];
  res.send(JSON.stringify({ success: true }));
});
app.post("/new-item", upload.array("mfiles", 9), async (req, res) => {
  console.log("request to /new-item, body: ", req.body);

  let files = req.files;
  console.log("uploaded files", files);

  let frontendPaths = files.map(file => {
    let filetype = file.mimetype;
    return { frontendPath: "/uploads/" + file.filename, filetype: filetype };
  });
  console.log("Frontend path array", frontendPaths);

  let insertReturn = await dbo
    .collection("filestable")
    .insertMany(frontendPaths);
  console.log("return after insert many in the table", insertReturn);

  let description = req.body.description;
  let price = parseFloat(req.body.price);
  let inventory = parseInt(req.body.inventory);
  let location = req.body.location;
  let seller = req.body.seller;
  let defaultPaths = frontendPaths[0];
  dbo.collection("items").insertOne(
    {
      description,
      price,
      inventory,
      location,
      seller,
      defaultPaths,
      frontendPaths: insertReturn.insertedIds
    },
    (error, item) => {
      if (error) {
        console.log("error with insert product to database, ", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }

      if (item.insertedCount === 1) {
        dbo
          .collection("inventory")
          .insertOne(
            { _id: item.ops[0]._id, inventory: inventory },
            (err, inventory) => {
              if (err) {
                console.log("error with the insert inventories, ", err);
                res.send(JSON.stringify({ success: false }));
                return;
              }
              res.send(JSON.stringify({ success: true }));
              return;
            }
          );
      }
    }
  );
});

app.get("/all-items", (req, res) => {
  console.log("request to /all-items");
  dbo
    .collection("items")
    .find({})
    .toArray((err, items) => {
      if (err) {
        console.log("error", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      // console.log("Items", items);
      res.send(JSON.stringify({ success: true, items: items }));
    });
});

app.get("/getmedia", (req, res) => {
  console.log("request to the get media");
  const mid = req.query.mid;

  dbo.collection("filestable").findOne({ _id: ObjectID(mid) }, (err, mpath) => {
    if (err) {
      console.log("/get media error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (mpath === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    console.log("mpath object", mpath);
    res.send(JSON.stringify({ success: true, mpath: mpath }));
  });
});

app.post("/order", upload.none(), (req, res) => {
  console.log("require to the order", req.body);
  const items = req.body.items;
  const shippingAddress = req.body.shippingAddress;
  const card = req.body.card;
  const username = req.body.username;

  dbo.collection("orders").insertOne({
    items,
    shippingAddress,
    username,
    card
  });
  res.send(JSON.stringify({ success: true }));
});

app.post("/orderCheck", upload.none(), async (req, res) => {
  // get userID from session

  console.log("in the orderCheck endpoiunt");
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  const userId = user.userId;
  const username = user.username;
  const inventory = dbo.collection("inventory");
  const carts = dbo.collection("carts");
  const orders = dbo.collection("orders");
  console.log("User ID ", userId);
  let cart = await carts.findOne({ userId: String(userId), state: "active" });
  let success = [];
  let failed = [];

  for (let i = 0; i < cart.products.length; i++) {
    let product = cart.products[i];
    let result = null;

    try {
      result = await inventory.findOneAndUpdate(
        {
          _id: ObjectID(product._id),
          quantity: { $gte: parseInt(product.quantity) }
        },
        {
          $inc: { quantity: -parseInt(product.quantity) },
          $push: {
            reservations: {
              quantity: parseInt(product.quantity),
              _id: cart._id,
              createdOn: new Date()
            }
          }
        }
      );
    } catch (err) {
      console.log("error ", err);
    }
    console.log(
      "results after updating the inventory with reservations ",
      result
    );
    if (result.lastErrorObject.updatedExisting) success.push(product);
    else failed.push(product);
  }
  console.log("Success array: ", success);
  console.log("Failed array,", failed);
  //if there are any products in the failed array, we need to rollback all the successful reservations into the
  //inventories collection.
  if (failed.length > 0) {
    for (let i = 0; i < success.length; i++) {
      let result = null;
      try {
        result = await inventory.findOneAndUpdate(
          {
            _id: ObjectID(success[i]._id),
            "reservations._id": cart._id
          },
          {
            $inc: { quantity: parseInt(success[i].quantity) },
            $pull: { reservations: { _id: cart._id } }
          },
          { returnOriginal: false }
        );
      } catch (err) {
        console.log("error, ", err);
      }
      console.log("results after rollback the inventories", result);
    }
    res.send(JSON.stringify({ success: false }));
    return;
  }

  // If we succeeded in reserving all the products we create an order document, /
  //set the cart to complete and release all the reservations from the inventories collection.

  orders.insertOne({
    created_on: new Date(),
    userId: userId,
    shipping: {
      name: username,
      address: "Some street 1, NY 11223"
    },
    payment: {
      method: "visa",
      transaction_id: "231221441XXXTD"
    },
    products: cart.products
  });

  carts.findOneAndUpdate(
    {
      _id: ObjectID(cart._id),
      state: "active"
    },
    {
      $set: { state: "completed" }
    }
  );

  inventory.updateMany(
    {
      "reservations._id": cart._id
    },
    {
      $pull: { reservations: { _id: cart._id } }
    },
    { upsert: false }
  );

  console.log("Cart in orderCheck endpoint, ", cart);
  res.send(JSON.stringify({ success: true }));
});
app.post("/charge", cors(), postCharge);

async function postCharge(req, res) {
  try {
    const { amount, source, receipt_email } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source,
      receipt_email
    });

    if (!charge) throw new Error("charge unsuccessful");

    res.status(200).json({
      message: "charge posted successfully",
      charge
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

app.post("/checkout", cors(), async (req, res) => {
  console.log("Request:", req.body);
  let error;
  let status = "";

  try {
    const { product, token } = req.body;
    //const product = req.body.product;
    console.log("Product information from frontend, ", product);
    //const token = req.body.token;
    console.log("Token for payment, ", token);
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotencyKey = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: product.name,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      { idempotencyKey }
    );

    console.log("Charged:", { charge });
    status = "success";
    //res.send(JSON.stringify({ success: true }));
  } catch (error) {
    console.log("Error:", error);
    status = "failure";
    //res.send(JSON.stringify({ success: false, error }));
  }
  res.json({ error, status });
});

app.get("/get-orders", (req, res) => {
  console.log("request to the get orders");

  console.log("in the orderCheck endpoiunt");
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  const userId = user.userId;

  const username = req.query.username;
  console.log("username", username);

  dbo
    .collection("orders")
    .find({ userId: ObjectID(userId) })
    .toArray((err, orders) => {
      if (err) {
        console.log("/get orders", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (orders === null) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      console.log("Orders object", orders);
      res.send(JSON.stringify({ success: true, data: orders }));
    });
});

app.post("/add-cart", upload.none(), async (req, res) => {
  console.log("IN the add-car endpoint, body", req.body);

  const userId = req.body.userId;
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  const description = req.body.description;
  const price = req.body.price;
  const existed = req.body.existedItem === "true" ? true : false;
  let newCart = null;

  if (existed) {
    try {
      newCart = await dbo.collection("carts").findOneAndUpdate(
        { userId: userId, state: "active", "products._id": productId },
        {
          $set: { modificationOn: new Date() },
          $inc: { "products.$.quantity": parseInt(quantity) }
        },
        { returnOriginal: false }
      );
    } catch (e) {
      console.log(
        "Error with the add add-cart when find and update a cart, ",
        e
      );
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (newCart) {
      console.log("New cart updated ", newCart);
      res.send(JSON.stringify({ success: true, cart: newCart.value }));
      return;
    }
  }

  try {
    newCart = await dbo.collection("carts").findOneAndUpdate(
      { userId: userId, state: "active" },
      {
        $set: { modificationOn: new Date() },
        $push: {
          products: {
            _id: productId,
            quantity: parseInt(quantity),
            description: description,
            price: price
          }
        }
      },
      { upsert: true, returnOriginal: false }
    );
  } catch (e) {
    console.log("Error with the add add-cart when find and update a cart, ", e);
    res.send(JSON.stringify({ success: false }));
    return;
  }
  if (newCart) {
    console.log("New cart updated ", newCart);
    res.send(JSON.stringify({ success: true, cart: newCart.value }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});
app.get("/delete-cartitem", async (req, res) => {
  const pid = req.query.pid;
  console.log("delete item in the cart, prduct id: ", pid);
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];
  if (user) {
    try {
      newCart = await dbo
        .collection("carts")
        .findOneAndUpdate(
          { userId: String(user.userId), state: "active" },
          { $pull: { products: { _id: String(pid) } } },
          { returnOriginal: false }
        );
    } catch (err) {
      console.log("Error with delete item from Cart", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (newCart) {
      console.log("New cart updated ", newCart);
      res.send(JSON.stringify({ success: true, cart: newCart.value }));
      return;
    }
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/update-address", upload.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  const user = sessions[sessionId];

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const line1 = req.body.address_line1;
  const line2 = req.body.address_line2;
  const city = req.body.city;
  const country = req.body.country;
  const postal_code = req.body.address_zip;
  const address_state = req.body.address_state;
  try {
    result = await dbo.collection("users").findOneAndUpdate(
      {
        _id: ObjectID(user.userId)
      },
      {
        $push: {
          shipping: {
            name: { firstname, lastname },
            address: {
              line1,
              line2,
              city,
              address_state,
              postal_code,
              country
            }
          }
        }
      },
      { returnOriginal: false }
    );
  } catch (err) {
    console.log("error ", err);
  }
  if (result) {
    console.log(
      "results after updating the users with shipping address ",
      result
    );
    res.send(
      JSON.stringify({ success: true, shipping: result.value.shipping })
    );
    return;
  }

  res.send(JSON.stringify({ success: false }));
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
