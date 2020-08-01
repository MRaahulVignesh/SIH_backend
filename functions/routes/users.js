const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

var serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://agri-b9eb7.firebaseio.com"
});

const db = admin.firestore();
const collection_name = "confirmedBids";

// create
router.post("/create", async function (req, res) {
  try {
    await db
      .collection(collection_name)
      .doc("/" + req.body.id + "/")
      .create(
          { farmerId: req.body.farmerId, 
            companyId: req.body.companyId,
            cropName: req.body.cropName,
            cropType: req.body.cropType,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice
        });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// get user with user id
router.get("/read/:user_id", async function (req, res) {
  try {
    const document = db
      .collection(collection_name)
      .doc("/" + req.params.user_id + "/");
    let item = await document.get();
    console.log(item);
    let response = item.data();
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

// read all
router.get("/read", async function (req, res) {
  try {
    let query = db.collection(collection_name);
    let response = [];
    await query.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      for (let doc of docs) {
        const selectedItem = {
          id: doc.id,
          email: doc.data().email,
          password: doc.data().password,
        };
        response.push(selectedItem);
      }
    });
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

// update
router.post("/update/:user_id", async function (req, res) {
  try {
    const document = db.collection(collection_name).doc(req.params.user_id);
    await document.update({
      email: req.body.email,
    });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

// delete
router.delete("/delete/:user_id", async function (req, res) {
  try {
    const document = db.collection(collection_name).doc(req.params.user_id);
    await document.delete();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
