"use strict";

var functions = require("firebase-functions");

var admin = require("firebase-admin");

admin.initializeApp(); // Purchase object will be sent from the client side to the back end server
// In the back end code, we need to extract the purchaseToken, orderId, purchaseTime from that Purchase object sent to the back end server.
// We need to check the firestore database if that particular Purchase object is already in the database. (We are checking with the purchaseToken of that purchase object)
// If that purchase object is already there, we send that purchase object back to the client
// Otherwise, we set the isValid variable of that purchase object to true, we then store that purchase object to the database. After that, we send back the Purchase object to the client.

exports.verifyPurchases = functions.https.onRequest(function (req, res) {
  var firestore = admin.firestore();
  var purchaseInfo = {
    purchaseToken: req.body.purchaseToken,
    orderId: req.body.orderId,
    purchaseTime: req.body.purchaseTime,
    isValid: false
  };
  firestore.collection('purchases').doc(purchaseInfo.purchaseToken).get().then(function (result) {
    if (result.exists) {
      res.json(purchaseInfo);
    } else {
      purchaseInfo.isValid = true;
      firestore.doc("purchases/".concat(purchaseInfo.purchaseToken)).set().then(function () {
        res.send(purchaseInfo);
      });
    }
  });
});