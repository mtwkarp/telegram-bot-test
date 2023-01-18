import Database from "./Database";
import {cert, initializeApp} from "firebase-admin/app";
import GoogleCredentialsManager from "../helpers/GoogleCredentialsManager";
import {getFirestore} from "firebase-admin/firestore";

export default class FireBaseDB extends Database {
    constructor() {
        super();
    }

    get allRemoteData(): object {
        return this.data
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

            const collectionObj = {};

            for (let j = 0; j < documentsList.length; j++) {
                const document = documentsList[j];
                const documentSnapshot = await document.get();
                // @ts-ignore
                collectionObj[documentSnapshot.id] = await documentSnapshot.data();
                this.setActionOnDocumentSnapshotOnAppLoad({collection: collection, document: document});
            }
            this.data[collection.id] = collectionObj;
        }
    }

    private async initApp(): Promise<void> {
        await initializeApp({
            credential: cert(GoogleCredentialsManager.serviceAccountCredentials as object)
        });
    }

    private setActionOnDocumentSnapshotOnAppLoad({collection, document}: { collection: any, document: any }) {
        let updateDataOnSnapshot = false;// value to skip first snapshot update, because data loaded earlier in loadRemoteData function

        // @ts-ignore
        document.onSnapshot(async (docSnapshot) => {
            if (updateDataOnSnapshot === true) {
                const data = await docSnapshot.data();
                // @ts-ignore
                this.data[collection.id][document.id] = data;
            }

            updateDataOnSnapshot = true;
        }, (err: Error) => {
            console.log(`Encountered error: ${err}`);
        });
    }
}