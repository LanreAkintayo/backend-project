"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var functions = require("firebase-functions");

var admin = require("firebase-admin");

admin.initializeApp(); // Purchase object will be sent from the client side to the back end server
// In the back end code, we need to extract the purchaseToken, orderId, purchaseTime from that Purchase object sent to the back end server.
// We need to check the firestore database if that particular Purchase object is already in the database. (We are checking with the purchaseToken of that purchase object)
// If that purchase object is already there, we send that purchase object back to the client
// Otherwise, we set the isValid variable of that purchase object to true, we then store that purchase object to the database.
// After that, we send back the Purchase object to the client.

exports.verifyPurchases = functions.https.onRequest(function (req, res) {
  var firestore = admin.firestore();
  var purchaseInfo = {
    purchaseToken: req.body.purchaseToken,
    orderId: req.body.orderId,
    purchaseTime: req.body.purchaseTime,
    isValid: false
  };
  firestore.collection("purchases").where("purchaseToken", "==", purchaseInfo.purchaseToken).get().then(function (result) {
    if (result.exists) {
      res.json(purchaseInfo);
    } else {
      purchaseInfo.isValid = true;
      firestore.collection("purchases").doc().set(_objectSpread({}, purchaseInfo)).then(function () {
        res.json(purchaseInfo);
      })["catch"](function (err) {
        return console.log(err);
      });
    }
  })["catch"](function (err) {
    return console.log(err);
  });
});