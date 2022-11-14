const BotCmdHandler = require('../BotCmdHandler');
const replyMessages = require('../../constants/replyMessages');
const { sheets_service_name } = require('../../constants/googleServicesNames');
const { SPREADSHEETID } = require('../../constants/spreadsheetsConstants');

class StartCmdHandler extends BotCmdHandler {
  constructor(bot, services) {
    super(bot, services);
    this.spreadsheet = services.sheets.spreadsheet;
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

    this.writeUserChatIdToSheets(ctx);
  }

  async writeUserChatIdToSheets(ctx) {
    const userId = ctx.update.message.from.id;
    const chatId = ctx.update.message.chat.id;

    const idsLetter = 'C';

    const idsData = await this.spreadsheet.spreadsheets.values.get({
      spreadsheetId: SPREADSHEETID,
      range: `Список інструкторів!${idsLetter}:${idsLetter}`
    });
    const flattenIdsData = idsData.data.values
        .flat()
        .map((id) => Number(id));

    let userRowByID = null;

    for (let i = 0; i < flattenIdsData.length; i++) {
      const instructorId = flattenIdsData[i];

      if (instructorId === userId) {
        userRowByID = i + 1;
        break;
      }
    }

    if (userRowByID === null) {
      console.log('This user id does not exist');
      return;
    }

    const chatIdsLetter = 'D';
    const writeRange = `Список інструкторів!${chatIdsLetter}${userRowByID}`;

    try {
      await this.spreadsheet.spreadsheets.values.update({
        spreadsheetId: SPREADSHEETID,
        range: writeRange,
        valueInputOption: 'RAW',
        resource: {
          values: [[chatId]]
        }
      });
    } catch (err) {
      console.log('cant write chat id');
      throw err;
    }
  }

  static _SERVICES = [sheets_service_name];
}

module.exports = StartCmdHandler;
