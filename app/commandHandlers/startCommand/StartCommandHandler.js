const BotCmdHandler = require('../BotCmdHandler');
const replyMessages = require('../../constants/replyMessages');
const { sheets_service_name } = require('../../constants/googleServicesNames');
const GoogleServicesManager = require('../../google/GoogleServicesManager.js')

class StartCmdHandler extends BotCmdHandler {
  constructor(bot) {
    super(bot);
    this.spreadsheet = GoogleServicesManager.getGoogleServiceByName(sheets_service_name).spreadsheet;
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
//refactor
  async writeUserChatIdToSheets(ctx) {
    const userId = ctx.update.message.from.id;
    const chatId = ctx.update.message.chat.id;

    const idsLetter = 'C';

    const idsData = await this.spreadsheet.spreadsheets.values.get({
      spreadsheetId: process.env.SCHEDULE_SPREADSHEET_ID,
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
        spreadsheetId: process.env.SCHEDULE_SPREADSHEET_ID,
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
}

module.exports = StartCmdHandler;
