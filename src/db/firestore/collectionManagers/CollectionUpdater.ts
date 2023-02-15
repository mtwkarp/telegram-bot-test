import { type ICollectionUpdater } from '../../ts/db_interfaces';
import { getFirestore } from 'firebase-admin/firestore';
export default class CollectionUpdater implements ICollectionUpdater {
  private readonly collection: Record<string, FirebaseFirestore.DocumentData>;
  private readonly collectionName: string;
  constructor(collection: Record<string, FirebaseFirestore.DocumentData>, collectionName: string) {
    this.collection = collection;
    this.collectionName = collectionName;
  }

  async setUpdates(): Promise<void> {
    const db = getFirestore();
    const collection = await db.collection(this.collectionName);
    const documents = await collection.listDocuments();

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      await this.setUpdateHook(doc);
    }
  }

  private async setUpdateHook(document: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>): Promise<void> {
    await new Promise(resolve => {
      document.onSnapshot(async(docSnapshot) => {
        const result = await this.updateCollection(docSnapshot);
        resolve(result);
      });
    });
  }

  private async updateCollection(docSnapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): Promise<void> {
    const data = await docSnapshot.data();

    if (data !== undefined) this.collection[docSnapshot.id] = data;
  }
}
