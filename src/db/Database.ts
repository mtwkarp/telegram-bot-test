import {IDatabase} from "./ts/db_interfaces";

export default abstract class Database implements IDatabase {

    protected data: { [key: string]: object }
    protected constructor() {
        this.data = {}
    }
    abstract initDataBase(): Promise<void>

    abstract loadRemoteData(): Promise<void>

    abstract get allRemoteData(): object
}