import EnvLoader from "./envLoader/EnvLoader";
import BotInteractionObserver from "./botInteractionManager/BotInteractionObserver";
import Bot from "./Bot";

export default class Main {
    bot: Bot
    botInteractionObserver: BotInteractionObserver
    public async init(): Promise<void> {
        this.initEnvironmentVariables();
        await this.initBot()
        this.initBotInteractionObserver()
    }

    private async initBot(): Promise<void> {
        this.bot = new Bot()
        await this.bot.initBot()
        await this.bot.launchBot()
    }

    private initEnvironmentVariables():void {
        EnvLoader.load()
    }

    private initBotInteractionObserver() {
        this.botInteractionObserver = new BotInteractionObserver()
        this.botInteractionObserver.subscribeForBotEvents(this.bot)
    }
}