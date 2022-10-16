const functions = require("firebase-functions");

const Bot = require("../app/Bot.js");

const KolesoBot = new Bot();

try {
  KolesoBot.initBot();
} catch (err) {
  console.log(err);
}


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  // functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
