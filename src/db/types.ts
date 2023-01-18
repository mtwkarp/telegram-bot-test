export interface IDatabase {
    initDataBase(): void,
    loadRemoteData(): void,

    get allRemoteData(): object
}

export interface IDatabaseCollectionManager {

}