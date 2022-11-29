const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

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
        // console.log('CHANGE', document.id)
        const data = await docSnapshot.data();
        // console.log(data, document.id)
        FireStoreDB.#data[collection.id][document.id] = data;
      }

      updateDataOnSnapshot = true;
    }, (err) => {
      console.log(`Encountered error: ${err}`);
    });
  }

  async initApp() {
    const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replaceAll('\\n','\n');

    console.log('heroku test action')
    console.log('test pull request update')
    await initializeApp({
      credential: cert({
        "type": process.env.SERVICE_ACCOUNT_TYPE,
        "project_id": process.env.SERVICE_ACCOUNT_PROJECT_ID,
        "private_key_id": process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
        "private_key": privateKey,
        "client_email": process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
        "client_id": process.env.SERVICE_ACCOUNT_CLIENT_ID,
        "auth_uri": process.env.SERVICE_ACCOUNT_AUTH_URI,
        "token_uri": process.env.SERVICE_ACCOUNT_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
        "client_x509_cert_url": process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL
      })
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
