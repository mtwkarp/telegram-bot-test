const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const GoogleCredentialsManager = require('./GoogleCredentialsManager.js')

class FireStoreDB {
  constructor() {
    this.db = null;
  }

  async initDatabase() {
    await this.initApp();
    await this.loadRemoteData();
  }

  async loadRemoteData() {
    this.db = getFirestore();
    const collectionsList = await this.db.listCollections();

    for (let i = 0; i < collectionsList.length; i++) {
      const collection = collectionsList[i];
      const documentsList = await collection.listDocuments();

      const collectionObj = {};

      for (let j = 0; j < documentsList.length; j++) {
        const document = documentsList[j];
        const documentSnapshot = await document.get();

        collectionObj[documentSnapshot.id] = await documentSnapshot.data();
        this.setActionOnDocumentSnapshotOnAppLoad(collection, document);
      }
      FireStoreDB.#data[collection.id] = collectionObj;
    }
  }

  setActionOnDocumentSnapshotOnAppLoad(collection, document) {
    let updateDataOnSnapshot = false;// value to skip first snapshot update, because data loaded earlier in loadRemoteData function

    document.onSnapshot(async (docSnapshot) => {
      if (updateDataOnSnapshot === true) {
        const data = await docSnapshot.data();

        FireStoreDB.#data[collection.id][document.id] = data;
      }

      updateDataOnSnapshot = true;
    }, (err) => {
      console.log(`Encountered error: ${err}`);
    });
  }

  async initApp() {
    const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replaceAll('\\n','\n');

    await initializeApp({
      credential: cert(GoogleCredentialsManager.serviceAccountCredentials)
    });
  }

  static getData(collection, doc, field) {
    let data = FireStoreDB.#data[collection][doc][field];

    if (typeof data === 'string') {
      data = data.replaceAll('<br />', '\n');
    }

    return data;
  }

  static getSheetsData(doc, field) {
    return FireStoreDB.getData('google_sheets', doc, field);
  }

  static getReplyMessage(doc, field) {
    return FireStoreDB.getData('reply_messages', doc, field);
  }

  static getTimeValueData(doc, field) {
    return FireStoreDB.getData('time_values', doc, field);
  }

  static #data = {
    // collections
    // documents
    // fields
  };
}

module.exports = FireStoreDB;
