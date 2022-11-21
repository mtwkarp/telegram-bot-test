const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
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
                this.setActionOnDocumentSnapshotOnAppLoad(collection, document)
            }
            FireStoreDB.#data[collection.id] = collectionObj
        }
    }

    setActionOnDocumentSnapshotOnAppLoad(collection, document) {
        let updateDataOnSnapshot = false//value to skip first snapshot update, because data loaded earlier in loadRemoteData function

        document.onSnapshot(async (docSnapshot) => {
            if(updateDataOnSnapshot === true) {
                // console.log('CHANGE', document.id)
                const data = await docSnapshot.data()
                // console.log(data, document.id)
                FireStoreDB.#data[collection.id][document.id] = data
            }

            updateDataOnSnapshot = true
        },err => {
            console.log(`Encountered error: ${err}`);
        })
    }

    async initApp() {
        await initializeApp({
            credential: cert(serviceAccount)
        })
    }

    static getData(collection, doc, field) {
        // console.log(`Firebase getting:\ncollection: '${collection}',\ndocument: '${doc}'\nfield: '${field}'`)
        // console.log(FireStoreDB.#data[collection][doc][field])
        return FireStoreDB.#data[collection][doc][field]
    }

    static getGoogleSheetsData(doc, field) {
        return FireStoreDB.getData('google_sheets', doc, field)
    }

    static getReplyMessage(doc, field) {
        return FireStoreDB.getData('reply_messages', doc, field)
    }

    static getTimeValueData(doc, field) {
        return FireStoreDB.getData('time_values', doc, field)
    }

    static #data = {
        //collections
                //documents
                    //fields
    }
}

module.exports = FireStoreDB