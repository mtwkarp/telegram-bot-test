const BotCmdHandler = require('../BotCmdHandler');
const replyMessages = require('../../constants/replyMessages');

class CommandsInfoHandler extends BotCmdHandler {
  constructor(bot, services) {
    super(bot, services);
    this.commands = {
      commandsInfo: {command: 'commandsinfo', description: 'Інформація по доступних командах бота.'}
    };
  }

  initCommand() {
    this.bot.command(this.commands.commandsInfo.command, (ctx) => {
      this.sendCommandsDescription(ctx);
    });
  }

  sendCommandsDescription(ctx) {
    const chatId = ctx.update.message.chat.id;
    ctx.telegram.sendMessage(chatId, replyMessages.commands.commandsDescription);
  }
}

module.exports = CommandsInfoHandler;
