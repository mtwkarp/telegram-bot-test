const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');

class FireStoreTest {
    constructor() {
        this.init()
    }

    async init() {
        initializeApp({
            credential: cert(serviceAccount)
        })

        const db = getFirestore()
        let data = {}
        const doc = await db.collection('reply_messages').doc('schedule');

        const observer = doc.onSnapshot((docSnapshot) => {
            console.log(docSnapshot.data());

        },err => {
            console.log(`Encountered error: ${err}`);

        })
        // console.log(observer)
        // console.log(doc)
    }
}

module.exports = FireStoreTest