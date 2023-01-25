import {Telegram} from "telegraf";

export default abstract class AbstractAutoMessenger {

    protected readonly tg: Telegram
    protected constructor() {
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string);
    }

    public abstract setScheduledMessages(): void
}
