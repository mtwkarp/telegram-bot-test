import type AbstractCollectionManager from './firestore/collectionManagers/AbstractCollectionManager';
import TimeCollection from './firestore/collectionManagers/implementations/TimeCollection';
import { type IDataBaseManager } from './ts/db_interfaces';
import FireStoreDB from './firestore/FireStoreDB';
import ReplyMsgCollection from './firestore/collectionManagers/implementations/ReplyMsgCollection';
import SheetsCollection from './firestore/collectionManagers/implementations/SheetsCollection';
import UsersCollection from './firestore/collectionManagers/implementations/UsersCollection';
import StickersCollection from './firestore/collectionManagers/implementations/StickersCollection';

export default class DataBaseManager implements IDataBaseManager {
  public async init() {
    await this.initDataBase();
    await this.initCollectionManagers();
  }

  private async initCollectionManagers(): Promise<void> {
    const collectionManagers: AbstractCollectionManager[] = [
      TimeCollection.getInstance(),
      ReplyMsgCollection.getInstance(),
      SheetsCollection.getInstance(),
      UsersCollection.getInstance(),
      StickersCollection.getInstance()
    ];

    for (let i = 0; i < collectionManagers.length; i++) {
      const CollectionManager = collectionManagers[i];

      await CollectionManager.init();
    }
  }

  private async initDataBase(): Promise<void> {
    const firebase = new FireStoreDB();

    await firebase.initDataBase();
  }
}
