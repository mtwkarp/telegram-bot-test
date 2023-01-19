import EnvLoader from "./envLoader/EnvLoader";
import TelegrafBot from "./TelegrafBot";
import PrivateScopeManager from "./user/PrivateScopeManager";
import PrivateUpdateSubject from "./tglib/botUpdatesObservers/PrivateUpdateSubject";
import {PRIVATE_UPDATE_TYPES} from "./tglib/tgTypes/botUpdatesTypes";
import {firebase_v1beta1} from "googleapis";
import FireStoreDB from "./db/firestore/FireStoreDB";
import TimeCollection from "./db/firestore/collectionManagers/implementations/TimeCollection";
import DataBaseManager from "./db/DataBaseManager";

export default class MyBot {
    public bot: TelegrafBot
    private privateUpdateSubject: PrivateUpdateSubject
    private userScopeManager: PrivateScopeManager
    private readonly privateMessagesTypes: PRIVATE_UPDATE_TYPES[]
    private readonly privateCommands: string[]
    constructor(privateMessagesTypes: PRIVATE_UPDATE_TYPES[], privateCommands: string[]) {
        this.privateMessagesTypes = privateMessagesTypes
        this.privateCommands = privateCommands
    }
    public async init(): Promise<void> {
        this.initEnvironmentVariables();
        await this.initDatabase()
        await this.initBot()
        this.initPrivateUpdateSubject()
        this.initUserScopeManager()
        this.subscribeForPrivateMessagesUpdates()


    }

    async initDatabase(): Promise<void> {
        const databaseManager = new DataBaseManager()

        await databaseManager.init()
    }
    private async initBot(): Promise<void> {
        this.bot = new TelegrafBot()
        await this.bot.initBot()
        await this.bot.launchBot()
    }

    private initEnvironmentVariables():void {
        EnvLoader.load()
    }

    private initUserScopeManager() {
        this.userScopeManager = new PrivateScopeManager()
    }
    private initPrivateUpdateSubject() {
        console.log('Private messages types: ', ...this.privateMessagesTypes)
        this.privateUpdateSubject = new PrivateUpdateSubject(this.privateMessagesTypes, this.privateCommands)
        this.privateUpdateSubject.subscribeForBotUpdates(this.bot)
    }

    private subscribeForPrivateMessagesUpdates() {
        this.privateUpdateSubject.registerObserver(this.userScopeManager)
    }
}