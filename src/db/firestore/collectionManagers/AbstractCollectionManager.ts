import CollectionUpdater from './CollectionUpdater';
import { type ICollectionManager } from '../../ts/db_interfaces';
import {getFirestore} from 'firebase-admin/firestore';
export default abstract class AbstractCollectionManager implements ICollectionManager {
  protected collection: Record<string, FirebaseFirestore.DocumentData>;

  protected collectionName: string;

  private initialized: boolean;
  protected constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collection = {};
    this.initialized = false;
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    const collectionUpdater = new CollectionUpdater(this.collection, this.collectionName);

    await collectionUpdater.setUpdates();

    this.initialized = true;
  }

  public getValueFromDocument(documentId: string, valueId: string): any {
    const doc: FirebaseFirestore.DocumentData | undefined = this.getDocument(documentId);

    if (doc === undefined) {
      return;
    }

    return this.getValue(doc, valueId);
  }

  public getAllDocumentValues(documentName: string): object {
    const copy = Object.assign({}, this.collection[documentName]);

    return copy;
  }

  protected getValue(doc: FirebaseFirestore.DocumentData, valueId: string): any {
    let value = doc[valueId];

    if (typeof value === 'string') {
      value = value.replaceAll('<br />', '\n');
    }

    return value;
  }

  protected async updateValue(docId: string, key: string, value: any): Promise<FirebaseFirestore.WriteResult> {
    const doc = await this.getDocumentClass(docId);

    return  doc.update({[key]: value});
  }
  protected async updateMultipleValues(docId: string, updateObj: Record<string, any>): Promise<FirebaseFirestore.WriteResult> {
    const doc = await this.getDocumentClass(docId);

    return doc.update(updateObj);
  }

  protected async getDocumentClass(docId: string): Promise<FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>>  {
    const db = getFirestore();
    const collection = await db.collection(this.collectionName);
    const doc = collection.doc(docId);

    return doc;
  }

  public getDocument(documentId: string): FirebaseFirestore.DocumentData | undefined {
    return this.collection[documentId];
  }
}
