const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.database();
var ref = db.ref("estore");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var braintree = require("braintree");
// replace these with production keys
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "b363hgqprs4ymcg2",
  publicKey: "7xywqqgyvy792ykc",
  privateKey: "553910b9c28dbd58caefe5804f53a15e"
});


exports.client_token = functions.https.onRequest((req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

exports.checkout = functions.https.onRequest((req, res) => {
  // I need uid, email, and nonce
  let uid = req.body.uid;
  let email = req.body.email;

  // check that I have what I need
  if(uid === undefined || email === undefined) {
    res.send({'status': 'failed', 'message': 'Authentication error.'});
    return;
  }

  // get user data
  return ref.child('users/'+uid).once('value', function (snap){
    let user = snap.val();
    if(user.email !== email) {
      res.send({'status': 'failed', 'message': 'Authentication failed'});
      return
    }

    // get total price of cart
    let this_item;
    price = 0;
    for (var key in user.cart){
      this_item = user.cart[key];
      price += parseFloat(this_item.price);
    }
    console.log('paying ', price, ' for ', email);

    // make payment
    var nonceFromTheClient = req.body.payment_method_nonce;
    gateway.transaction.sale({
      amount: price.toFixed(2),
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    }, function (err, result) {
      // payment has been made, unless there's an error
      // tell client that payment was made, or error
      res.send({
        'status': result.transaction.status,
        'message': result.message
      });
      res.end();
      if(!result.success){
        // if payment not made, don't continue
        return;
      }

      // update database to reflect purchase
      // paths relative to estore/
      let for_db = {};
      for_db['users/'+uid+'/cart'] = null;

      let curr_time = Date.now();
      let order_id = "o_" + curr_time + "_"+Math.floor(Math.random()*1000);
      let past_orders;
      if (user.past_orders === undefined)
        past_orders = [];
      else
        past_orders = user.past_orders;
      past_orders.push(order_id);
      for_db['users/'+uid+'/past_orders'] = past_orders;

      let db_order = {
        'id': order_id,
        'time': curr_time,
        'total_price': price,
        'user': {
          'uid': uid,
          'email': user.email,
        },
        'items': {},
      };

      ref.child('items').once('value', function(snap){
        let items = snap.val();
        let curr_item;

        for(var items_key in items) {
          curr_item = items[items_key];

          // in for_db dict, set items[item id] to this item
          db_order['items'][ curr_item['id'] ] = curr_item;
        }

        for_db['past_orders/'+order_id] = db_order;

        ref.update(for_db, function(error) {
          if (error)
            console.log("Data could not be saved." + error);
        });
      })
    });
  }, function (err) {
    // failed to get user data
    res.send({'status': 'failed', 'message': err.message);
    return;
  });

});
