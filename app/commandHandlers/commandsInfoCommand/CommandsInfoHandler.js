const BotCmdHandler = require('../BotCmdHandler');
const FirebaseDB = require('../../google/FireStoreDB');

class CommandsInfoHandler extends BotCmdHandler {
  constructor(bot) {
    super(bot);
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
    ctx.telegram.sendMessage(chatId, FirebaseDB.getReplyMessage('commands', 'commands_description'));
  }
}

module.exports = CommandsInfoHandler;
