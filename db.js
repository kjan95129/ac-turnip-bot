const admin = require("firebase-admin");
const moment = require("moment");
const helpers = require("./helpers");

let serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

// Grabs all data for a certain user
function getUser(d_id, user) {
  return db
    .collection("d_id")
    .doc(d_id)
    .collection("users")
    .doc(user)
    .get();
}

// Grabs all data for a certain day
function getDate(d_id, date) {
  return db
    .collection("d_id")
    .doc(d_id)
    .collection("dates")
    .doc(date)
    .get();
}

function setCode(d_id, user, code) {
  getUser(d_id, user).then(doc => {
    let currDoc = doc.data() || null;

    db.collection("d_id")
      .doc(d_id)
      .collection("users")
      .doc(user)
      .set({
        ...currDoc,
        code: code
      });
  });
}

function setFruit(d_id, user, fruit) {
  getUser(d_id, user).then(doc => {
    let currDoc = doc.data() || null;

    db.collection("d_id")
      .doc(d_id)
      .collection("users")
      .doc(user)
      .set({
        ...currDoc,
        fruit: fruit
      });
  });
}

function getTurnipPrice(d_id, user) {
  if (user === "all") {
    return getDate(d_id, helpers.today);
  }

  return getUser(d_id, user);
}

/**
 * Adds turnip price to database
 * @param {string} user - discord username
 * @param {number} price - price of turnip
 */
function addTurnipPrice(d_id, user, price) {
  getUser(d_id, user).then(doc => {
    let currData = doc.data() || null
    let currHistory = (doc.data() && doc.data().history) || [];
    let newHistory = {
      ...currData,
      history: [
        ...currHistory,
        {
          price: price,
          timestamp: moment().unix()
        }
      ]
    };

    db.collection("d_id")
      .doc(d_id)
      .collection("users")
      .doc(user)
      .set(newHistory);
  });

  getDate(d_id, helpers.today).then(doc => {
    let currHistory = (doc.data() && doc.data().history) || [];
    let newHistory = {
      history: [
        ...currHistory,
        {
          user: user,
          price: price,
          timestamp: moment().unix()
        }
      ]
    };

    db.collection("d_id")
      .doc(d_id)
      .collection("dates")
      .doc(helpers.today)
      .set(newHistory);
  });
}

module.exports = {
  getUser: getUser,
  getDate: getDate,
  getTurnipPrice: getTurnipPrice,
  setCode: setCode,
  setFruit: setFruit,
  addTurnipPrice: addTurnipPrice
};
