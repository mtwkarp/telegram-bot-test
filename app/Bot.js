const GoogleServicesManager = require('./google/GoogleServicesManager.js');
const CmdHandlersManager = require('./commandHandlers/СmdHandlersManager.js');
const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

class Bot {
  constructor() {
    this.googleServicesManager = new GoogleServicesManager();
    this.bot = null;
    this.cmdHandlersManager = new CmdHandlersManager();
  }

  loadEnvironmentVariables() {
    let tgToken = null,
        tgChannelId = null;

    dotenv.config();

    if (process.env.mode === 'development') {
      tgToken = process.env.TELEGRAM_BOT_TOKEN_DEVELOPMENT;
      tgChannelId = process.env.TELEGRAM_CHANNEL_ID_DEVELOPMENT
    } else {
      tgToken = process.env.TELEGRAM_BOT_TOKEN_PRODUCTION;
      tgChannelId = process.env.TELEGRAM_CHANNEL_ID_PRODUCTION
    }

    process.env.TELEGRAM_BOT_TOKEN = tgToken
    process.env.TELEGRAM_CHANNEL_ID = tgChannelId
  }

  createTelegramBot() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  }

  async initBot() {
    this.loadEnvironmentVariables();
    this.createTelegramBot();
    await this.initGoogleServices();

    this.initCommandHandlers();
    this.initCommands();
    this.subscribeForEvents();
    this.bot.launch();

    console.log('Successful init');
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
    this.bot.on('callback_query', (ctx) => this.onCallbackQueryEvent(ctx));
  }

  onCallbackQueryEvent(ctx) {
    this.cmdHandlersManager.onCallbackQuery(ctx);
  }
}

module.exports = Bot;
