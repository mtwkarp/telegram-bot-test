class BotCmdHandler {
  // services = { sheets: {}, drive: {} }
  constructor(bot) {
    this.bot = bot;
    this.messageIds = [];
    this.commands = {
      // schedule: {command: 'Розклад', description: 'Надіслати розклад'} // example
    };
    this.activeUserMessages = {
      // [userid]: activeMessageId
    };
  }

  initCommand() {}

  onCallbackQuery(ctx) {}
}

module.exports = BotCmdHandler;
