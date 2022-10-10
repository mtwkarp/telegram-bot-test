const GoogleServicesManager = require('./google/GoogleServicesManager.js')
const CmdHandlersManager = require('./commandHandlers/СmdHandlersManager.js')
const {Telegraf} = require("telegraf");
const token = '5578721046:AAFL3QeNl7tpunNcic5_nRDGodArhNgnpD4'

class Bot {
    constructor() {
        this.googleServicesManager = new GoogleServicesManager()
        this.bot = new Telegraf(token)
        this.cmdHandlersManager = new CmdHandlersManager()
    }

    async initBot() {
        await this.initGoogleServices()

        this.initCommandHandlers()
        this.initCommands()
        this.subscribeForEvents()
        this.bot.launch()
    }

    async initGoogleServices() {
        await this.googleServicesManager.init()
    }

    initCommandHandlers() {
        this.cmdHandlersManager.initCommandHandlers(this.bot, this.googleServicesManager)
    }

    initCommands() {
        this.cmdHandlersManager.initCommands(this.bot)
    }

    subscribeForEvents() {
        this.bot.on('callback_query', (ctx) => this.onCallbackQueryEvent(ctx))
    }

    onCallbackQueryEvent(ctx) {
        this.cmdHandlersManager.onCallbackQuery(ctx)
    }
}

module.exports = Bot