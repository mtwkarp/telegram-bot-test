
class BotCmdHandler {
    //services = { sheets: {}, drive: {} }
    constructor(bot, services) {
        this.bot = bot
        this.services = services
        this.messageIds = []
        this.commands = {
            // schedule: {command: 'Розклад', description: 'Надіслати розклад'} // example
        }
        this.activeUserMessages = {
            //[userid]: activeMessageId
        }

    }

    initCommand() {

    }

    onCallbackQuery(ctx) {

    }

    static _SERVICES = []
}

module.exports = BotCmdHandler