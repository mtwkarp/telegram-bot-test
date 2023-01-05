import EnvLoader from "./envLoader/EnvLoader";
import BotInteractionObservable from "./botInteractionManager/BotInteractionObservable";
import Bot from "./Bot";
import PrivateScopeManager from "./user/PrivateScopeManager";
import PrivateUpdateSubject from "./tglib/botUpdatesObservers/PrivateUpdateSubject";

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
        this.privateUpdateSubject = new PrivateUpdateSubject()
        this.privateUpdateSubject.subscribeForBotUpdates(this.bot)
    }

    private subscribeForPrivateMessagesUpdates() {
        this.privateUpdateSubject.registerObserver(this.userScopeManager)
    }
}