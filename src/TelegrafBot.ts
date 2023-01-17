

import {Telegraf} from "telegraf";
import {commandsDescription} from "./static/commandsInfo";
export default class TelegrafBot extends Telegraf {
    constructor() {
        super(process.env.TELEGRAM_BOT_TOKEN as string);
    }

    async initBot(): Promise<void> {
        await this.initCommands()
    }

    public async launchBot(): Promise<void> {
        this.launch()
    }

    private async initCommands(): Promise<void> {
        const commandsArr = []
        for (const key in commandsDescription) {
            commandsArr.push(commandsDescription[key])
        }

        await this.telegram.setMyCommands(commandsArr)
            .then(() => console.log('COMMANDS are set successfully'))
            .catch((err) => console.error(err));
    }
}


