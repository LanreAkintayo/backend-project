const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Purchase object will be sent from the client side to the back end server

// In the back end code, we need to extract the purchaseToken, orderId, purchaseTime from that Purchase object sent to the back end server.

// We need to check the firestore database if that particular Purchase object is already in the database. (We are checking with the purchaseToken of that purchase object)

// If that purchase object is already there, we send that purchase object back to the client

// Otherwise, we set the isValid variable of that purchase object to true, we then store that purchase object to the database.

// After that, we send back the Purchase object to the client.

exports.verifyPurchases = functions.https.onRequest((req, res) => {
  const firestore = admin.firestore();

  let purchaseInfo = {
    purchaseToken: req.query.purchaseToken,
    orderId: req.query.orderId,
    purchaseTime: req.query.purchaseTime,
    isValid: false,
  };

  firestore
    .collection("purchases")
    .where("purchaseToken", "==", purchaseInfo.purchaseToken)
    .get()
    .then((result) => {
      if (result.docs.length > 0) {
        res.json(purchaseInfo);
      } else {
        purchaseInfo.isValid = true;
        firestore
          .collection("purchases")
          .doc()
          .set({ ...purchaseInfo })
          .then((result1) => {
            res.json(purchaseInfo);
          })
          .catch(err => console.log(err));
      }
    }).catch(err => console.log(err))
});

// https://us-central1-freshers-guide.cloudfunctions.net/verifyPurchases