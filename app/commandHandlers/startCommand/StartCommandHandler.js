const BotCmdHandler = require('../BotCmdHandler');
const replyMessages = require('../../constants/replyMessages');

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
    ctx.telegram.sendMessage(chatId, replyMessages.start.botIntroduction);
  }
}

module.exports = StartCmdHandler;
