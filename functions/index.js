const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


exports.verifyPurchases = functions.https.onRequest(
    (req, res) => {
        var purchaseInfo = {
            purchaseToken: req.query.purchaseToken,
            orderId: req.query.orderId,
            purchaseTime: req.query.purchaseTime,
            isValid: false
        }
        var firestore = admin.firestore();
        firestore.doc(`purchases/${purchaseInfo.purchaseToken}`).get().then(
            (result) => {
                if (result.exists) {
                    res.send(purchaseInfo);
                } else {
                    purchaseInfo.isValid = true;
                    firestore.doc(`purchases/${purchaseInfo.purchaseToken}`).set().then(
                        () => {
                            res.send(purchaseInfo);
                        }
                    );
                }
            }
        );
    }
);
