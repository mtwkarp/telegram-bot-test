const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');

class FireStoreDB {
    constructor() {
        this.db = null
    }

    async initDatabase() {
        await this.initApp()
        await this.loadRemoteData()
    }

    async loadRemoteData() {
        this.db = getFirestore()
        const collectionsList = await this.db.listCollections()

        for (let i = 0; i < collectionsList.length; i++) {
            const collection = collectionsList[i],
                documentsList = await collection.listDocuments()

            const collectionObj = {}

            for (let j = 0; j < documentsList.length; j++) {
                const document = documentsList[j]
                const documentSnapshot = await document.get()

                collectionObj[documentSnapshot.id] = await documentSnapshot.data()

                document.onSnapshot(async (docSnapshot) => {
                    collectionObj[document.id] = await docSnapshot.data()
                    console.log('CHANGE', document.id)
                },err => {
                    console.log(`Encountered error: ${err}`);
                })

            }
            FireStoreDB.#data[collection.id] = collectionObj
        }
        // console.log(FireStoreDB.#data)

    }


    async initApp() {
        await initializeApp({
            credential: cert(serviceAccount)
        })
    }

    static async getData(collection, doc, field) {
        FireStoreDB.#data[collection].doc(doc).get({source: 'cache'})
        return FireStoreDB.#data[collection].doc(doc).get({source: 'cache'}).get(field)
    }

    static getGoogleSheetsData(doc, field) {
        FireStoreDB.getData('google_sheets', doc, field)
    }

    static getReplyMessage(doc, field) {
        FireStoreDB.getData('reply_messages', doc, field)
    }

    static getTimeValueData(doc, field) {
        FireStoreDB.getData('time_values', doc, field)
    }

    static #data = {
        //collections
                //documents
                    //fields
    }
}

module.exports = FireStoreDB