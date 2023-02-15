export interface IDatabase {
  initDataBase: () => void
  loadRemoteData: () => void

  get allRemoteData(): object
}

export interface IDataBaseManager {
  init: () => void
}

export interface ICollectionUpdater {
  setUpdates: () => void
}

export interface ICollectionManager {
  init: () => void
  getValueFromDocument: (documentId: string, valueId: string) => any

  getDocument: (documentId: string) => any

}
