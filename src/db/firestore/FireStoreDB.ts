import Database from '../Database';
import { cert, initializeApp } from 'firebase-admin/app';
import GoogleCredentialsManager from '../../helpers/GoogleCredentialsManager';
import { getFirestore } from 'firebase-admin/firestore';

export default class FireStoreDB extends Database {
  constructor() {
    super();
  }

  get allRemoteData(): object {
    return this.data;
  }

  async initDataBase(): Promise<void> {
    await this.initApp();
    await this.loadRemoteData();
  }

  async loadRemoteData(): Promise<void> {
    const db = getFirestore();
    const collectionsList = await db.listCollections();

    for (let i = 0; i < collectionsList.length; i++) {
      const collection = collectionsList[i];
      const documentsList = await collection.listDocuments();

      const collectionObj: {[key: string]: FirebaseFirestore.DocumentData}= {};

      for (let j = 0; j < documentsList.length; j++) {
        const document = documentsList[j];
        const documentSnapshot = await document.get();
        const docData: undefined | FirebaseFirestore.DocumentData = await documentSnapshot.data();

        if(docData === undefined) continue;

        collectionObj[documentSnapshot.id] = docData;

        this.setActionOnDocumentSnapshotOnAppLoad({ collection, document });
      }
      this.data[collection.id] = collectionObj;
    }
  }

  private async initApp(): Promise<void> {
    await initializeApp({
      credential: cert(GoogleCredentialsManager.serviceAccountCredentials as object)
    });
  }

  private setActionOnDocumentSnapshotOnAppLoad({ collection, document }: { collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>, document: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData> }) {
    let updateDataOnSnapshot = false;// value to skip first snapshot update, because data loaded earlier in loadRemoteData function

    document.onSnapshot(async(docSnapshot) => {
      if (updateDataOnSnapshot) {
        const data: undefined | FirebaseFirestore.DocumentData = await docSnapshot.data();
        const collectionId = collection.id;

        if(this.data[collectionId]) {
          const collectionObj = this.data[collectionId] as {[key: string]: object};

          if(data !== undefined) collectionObj[document.id] = data;
        }
      }

      updateDataOnSnapshot = true;
    }, (err: Error) => {
      console.log(`Encountered error: ${err}`);
    });
  }
}
