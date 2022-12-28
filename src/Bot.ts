

import {Telegraf} from "telegraf";
import {commandsDescription} from "./static/commandsInfo";
export default class Bot extends Telegraf {
    constructor() {
        super(process.env.TELEGRAM_BOT_TOKEN as string);
    }

    async initBot(): Promise<void> {
        await this.initCommands()
    }

    public async launchBot(): Promise<void> {
        await this.launch()
            .then(() => console.log('Successful BOT launch'))
            .catch((err: string) => console.error(err))
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


