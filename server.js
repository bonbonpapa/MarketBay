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
    .findOne({ _id: String(userId), state: "active" });
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
  let price = req.body.price;
  let inventory = req.body.inventory;
  let location = req.body.location;
  let seller = req.body.seller;
  let defaultPaths = frontendPaths[0];
  dbo.collection("items").insertOne({
    description,
    price,
    inventory,
    location,
    seller,
    defaultPaths,
    frontendPaths: insertReturn.insertedIds
  });
  res.send(JSON.stringify({ success: true }));
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
  console.log("request to the get media");
  const username = req.query.username;
  console.log("username", username);

  dbo
    .collection("orders")
    .find({ username: username })
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
  let newCart = null;

  try {
    newCart = await dbo.collection("carts").findOneAndUpdate(
      { _id: userId, state: "active" },
      {
        $set: { modificationOn: new Date() },
        $push: {
          products: {
            _id: productId,
            quantity: quantity,
            description: description,
            price: price
          }
        }
      },
      { upsert: true, returnOriginal: false }
    );
  } catch (e) {
    print(e);
    res.send(JSON.stringify({ success: false }));
  }
  console.log("New cart updated ", newCart);
  res.send(JSON.stringify({ success: true, cart: newCart.value }));
});
// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
