import EnvLoader from "./envLoader/EnvLoader";
import Bot from "./Bot";
import PrivateScopeManager from "./user/PrivateScopeManager";
import PrivateUpdateSubject from "./tglib/botUpdatesObservers/PrivateUpdateSubject";
import {PRIVATE_UPDATE_TYPES} from "./tglib/tgTypes/botUpdatesTypes";
import {CMD_NAME_TYPE, CMD_NAMES} from "./types/commandTypes";

export default class Main {
    private bot: Bot
    private privateUpdateSubject: PrivateUpdateSubject
    private userScopeManager: PrivateScopeManager
    public async init(): Promise<void> {
        this.initEnvironmentVariables();
        await this.initBot()
        this.initPrivateUpdateSubject()
        this.initUserScopeManager()
        this.subscribeForPrivateMessagesUpdates()
    }

    private async initBot(): Promise<void> {
        this.bot = new Bot()
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
        const {text, callback_query, command, animation, audio, document, photo, sticker, video, video_note, voice, edited_message} = PRIVATE_UPDATE_TYPES
        const messagesTypes: PRIVATE_UPDATE_TYPES[] = [
            text,
            callback_query,
            command,
            animation,
            audio,
            document,
            photo,
            sticker,
            video,
            video_note,
            voice,
            edited_message
        ]
        const commands: CMD_NAME_TYPE[] = [CMD_NAMES.SCHEDULE]

        this.privateUpdateSubject = new PrivateUpdateSubject(messagesTypes, commands)
        this.privateUpdateSubject.subscribeForBotUpdates(this.bot)
    }

    private subscribeForPrivateMessagesUpdates() {
        this.privateUpdateSubject.registerObserver(this.userScopeManager)
    }
}