import EnvLoader from "./envLoader/EnvLoader";
import TelegrafBot from "./TelegrafBot";
import PrivateScopeManager from "./user/PrivateScopeManager";
import PrivateUpdateSubject from "./tglib/botUpdatesObservers/PrivateUpdateSubject";
import {PRIVATE_UPDATE_TYPES} from "./tglib/tgTypes/botUpdatesTypes";
import {CMD_NAME_TYPE, CMD_NAMES} from "./types/commandTypes";
import UpdateTemplatesCreator from "./tglib/helpers/UpdateTemplatesCreator";
import {Context} from "telegraf";
import {Update} from "typegram";

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
        await this.initBot()
        this.initPrivateUpdateSubject()
        this.initUserScopeManager()
        this.subscribeForPrivateMessagesUpdates()
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