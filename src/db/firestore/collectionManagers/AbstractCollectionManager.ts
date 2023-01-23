import CollectionUpdater from "./CollectionUpdater";
import {ICollectionManager} from "../../types";
export default abstract class AbstractCollectionManager implements ICollectionManager{
    protected collection: { [key: string]: FirebaseFirestore.DocumentData };

    protected collectionName: string

    private initialized: boolean
    protected constructor(collectionName: string) {
        this.collectionName = collectionName
        this.collection = {}
        this.initialized = false
    }
    public async init(): Promise<void> {
        if(this.initialized) return

        const collectionUpdater = new CollectionUpdater(this.collection, this.collectionName)

        await collectionUpdater.setUpdates()

        this.initialized = true
    }

    public getValueFromDocument(documentId: string, valueId: string): any {
        const doc: FirebaseFirestore.DocumentData | undefined = this.getDocument(documentId)

        if(doc === undefined) {
            return
        }

        return this.getValue(doc, valueId)
    }
    //implement !
    // public getAllDocumentValues() {
    //
    // }

    protected getValue(doc: FirebaseFirestore.DocumentData, valueId: string): any {
        let value = doc[valueId]

        if (typeof value === 'string') {
            value = value.replaceAll('<br />', '\n');
        }

        return value
    }
    public getDocument(documentId: string): FirebaseFirestore.DocumentData | undefined {
        return this.collection[documentId]
    }

}

