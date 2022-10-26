const GoogleServicesManager = require("./google/GoogleServicesManager.js");
const CmdHandlersManager = require("./commandHandlers/СmdHandlersManager.js");
const { Telegraf } = require("telegraf");
const dotenv = require("dotenv");

class Bot {
  constructor() {
    this.loadEnvironmentVariables();

    this.googleServicesManager = new GoogleServicesManager();
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    this.cmdHandlersManager = new CmdHandlersManager();
  }

  loadEnvironmentVariables() {
    // if (process.env.mode === "development") {
      dotenv.config();
    // } else if (process.env.mode === "production") {
    //   dotenv.config();
    // }
  }

  async initBot() {
    await this.initGoogleServices();

    this.initCommandHandlers();
    this.initCommands();
    this.subscribeForEvents();
    this.bot.launch();

    console.log("succesfull init");
  }

  async initGoogleServices() {
    await this.googleServicesManager.init();
  }

  initCommandHandlers() {
    this.cmdHandlersManager.initCommandHandlers(
      this.bot,
      this.googleServicesManager
    );
  }

  initCommands() {
    this.cmdHandlersManager.initCommands(this.bot);
  }

  subscribeForEvents() {
    this.bot.on("callback_query", (ctx) => this.onCallbackQueryEvent(ctx));
  }

  onCallbackQueryEvent(ctx) {
    this.cmdHandlersManager.onCallbackQuery(ctx);
  }
}

module.exports = Bot;
