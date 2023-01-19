import {ICollectionUpdater} from "../../types";
import {getFirestore} from "firebase-admin/firestore";
export default class CollectionUpdater implements ICollectionUpdater {
    private readonly collection: { [key: string]: FirebaseFirestore.DocumentData };
    private readonly collectionName: string
    constructor(collection: { [key: string]: FirebaseFirestore.DocumentData}, collectionName: string) {
        this.collection = collection
        this.collectionName = collectionName
    }

    async setUpdates(): Promise<void> {
        const db = getFirestore();
        const collection = await db.collection(this.collectionName)
        const documents = await collection.listDocuments()

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i]
            await this.setUpdateHook(doc)
        }
    }

    private async setUpdateHook(document:  FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): Promise<void> {
        return new Promise(resolve => {
            document.onSnapshot(async (docSnapshot) => {
                await this.updateCollection(docSnapshot)
                resolve()
            })
        })

    }

    private async updateCollection(docSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): Promise<void> {
        const data = await docSnapshot.data();

        if(data !== undefined) this.collection[docSnapshot.id] = data
    }
}