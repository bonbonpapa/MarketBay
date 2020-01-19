let express = require("express");
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

let dbo = undefined;
let url =
  "mongodb+srv://bob:bobuse@cluster0-peipd.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  dbo = client.db("media-board");
});

// Your endpoints go after this line

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
  dbo.collection("users").findOne({ username: username }, (err, user) => {
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
      sessions[sessionId] = username;
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true }));
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
  dbo.collection("items").insertOne({
    description,
    price,
    inventory,
    location,
    seller,
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
      console.log("Items", items);
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
// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
