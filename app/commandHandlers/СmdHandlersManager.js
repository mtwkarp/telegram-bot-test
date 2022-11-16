const ScheduleCmdHandler = require('./scheduleCommand/ScheduleCmdHandler.js');
const StartCmdHandler = require('./startCommand/StartCommandHandler.js');
const CommandsInfoHandler = require('./commandsInfoCommand/CommandsInfoHandler.js');

class CmdHandlersManager {
  constructor() {
    this.cmdHandlers = [];
  }

  init(bot) {
    this.initCommandHandlers(bot)
    this.initCommands(bot)
  }

  initCommandHandlers(bot) {
    const handlers = [CommandsInfoHandler, ScheduleCmdHandler, StartCmdHandler];

    handlers.forEach((h) => {
      const Handler = new h(bot);

      Handler.initCommand();

      this.cmdHandlers.push(Handler);
    });
  }

  initCommands(bot) {
    this.registerCommands(bot);
  }

  registerCommands(bot) {
    const commandsDescriptions = [];
    this.cmdHandlers.forEach((cmdHandler) => {
      for (const commandKey in cmdHandler.commands) {
        const cmdInfo = cmdHandler.commands[commandKey];
        commandsDescriptions.push({
          command: cmdInfo.command,
          description: cmdInfo.description
        });
      }
    });

    bot.telegram.setMyCommands(commandsDescriptions);
  }

  onCallbackQuery(ctx) {
    const userId = ctx.update.callback_query.from.id;
    const messageId = ctx.update.callback_query.message.message_id;
    const currentMessageHandler = this.findCurrentHandlerByMessageId(messageId, userId);

    if (currentMessageHandler === undefined) return;

    currentMessageHandler.onCallbackQuery(ctx);
  }

  findCurrentHandlerByMessageId(messageId, userId) {
    return this.cmdHandlers.find((handler) => handler.activeUserMessages[userId] === messageId);
  }
}

module.exports = CmdHandlersManager;
