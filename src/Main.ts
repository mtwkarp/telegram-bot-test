import EnvLoader from "./envLoader/EnvLoader";
import BotInteractionObservable from "./botInteractionManager/BotInteractionObservable";
import Bot from "./Bot";
import PrivateScopeManager from "./user/PrivateScopeManager";

export default class Main {
    private bot: Bot
    private botInteractionObserver: BotInteractionObservable
    private userScopeManager: PrivateScopeManager
    public async init(): Promise<void> {
        this.initEnvironmentVariables();
        await this.initBot()
        this.initBotInteractionObserver()
        // this.initUserScopeManager()
        // this.subscribeForBotObserver()
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
    private initBotInteractionObserver() {
        this.botInteractionObserver = new BotInteractionObservable()
        this.botInteractionObserver.subscribeForBotEvents(this.bot)
    }

    private subscribeForBotObserver() {
        this.botInteractionObserver.subscribeListener(this.userScopeManager)
    }
}