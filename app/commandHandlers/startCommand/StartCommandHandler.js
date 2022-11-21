const BotCmdHandler = require('../BotCmdHandler');
const FirebaseDB = require('../../FireStoreDB');

class StartCmdHandler extends BotCmdHandler {
  constructor(bot) {
    super(bot);

    this.subscribeForStartMessage();
  }

  subscribeForStartMessage() {
    this.bot.on('message', (ctx) => this.onStartMessage(ctx));
  }

  onStartMessage(ctx) {
    const message = ctx.update.message.text;

    if (message !== '/start') {
      return;
    }

    const chatId = ctx.update.message.chat.id;
    ctx.telegram.sendMessage(chatId, FirebaseDB.getReplyMessage('start', 'bot_introduction'));
  }
}

module.exports = StartCmdHandler;
