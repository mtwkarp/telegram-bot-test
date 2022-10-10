const ScheduleCmdHandler = require('./ScheduleCmdHandler.js')

class CmdHandlersManager {
    constructor() {
        this.cmdHandlers = []
    }

    initCommandHandlers(bot, googleServicesManager) {
        const handlers = [ScheduleCmdHandler]

        handlers.forEach(h => {
            const services = googleServicesManager.getServicesObjByNames(h._SERVICES)
            const Handler = new h(bot, services)

            Handler.initCommand()

            this.cmdHandlers.push(Handler)
        })
    }

    initCommands(bot) {
        this.cmdHandlers.forEach(cmdHandler => cmdHandler.initCommand())
        this.registerCommands(bot)
    }

    registerCommands(bot) {
        const commandsDescriptions = []
        this.cmdHandlers.forEach(cmdHandler => {
             for (const commandKey in cmdHandler.commands) {
                 const cmdInfo = cmdHandler.commands[commandKey]
                 commandsDescriptions.push({command: cmdInfo.command, description: cmdInfo.description})
             }
         })

        bot.telegram.setMyCommands(commandsDescriptions)
    }

    onCallbackQuery(ctx) {
        const messageId = ctx.update.callback_query.message.message_id
        const currentMessageHandler = this.findCurrentHandlerByMessageId(messageId)

        if(currentMessageHandler === undefined) return

        currentMessageHandler.onCallbackQuery(ctx)
    }

    findCurrentHandlerByMessageId(messageId) {
        return this.cmdHandlers.find(handler => handler.activeMessageId === messageId)
    }
}

module.exports = CmdHandlersManager