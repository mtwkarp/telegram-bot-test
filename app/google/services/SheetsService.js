const GoogleService = require('./GoogleServiceInterface.js');
const { google } = require('googleapis');

class SheetsService extends GoogleService {
  constructor(authenticationObj) {
    super(authenticationObj);

    this.spreadsheet = null;
    this.spreadsheetId = ''
    this.values = null;

    this.initService(authenticationObj);
  }

  setSpreadSheetId(id) {
    this.spreadsheetId = id
  }

  initService(authenticationObj) {
    this.spreadsheet = google.sheets({
      version: 'v4',
      auth: authenticationObj
    });

    this.values = this.spreadsheet.spreadsheets.values
  }

  async getSheetValues({range}) {
    const values = (await this.values.get({
      spreadsheetId: this.spreadsheetId,
      range
    })).data.values;

    return values
  }

  async updateSheetValues(options = {range: '', valueInputOption: 'USER_ENTERED', majorDimension: 'COLUMNS', values: []}) {
    const inputOptions = options.valueInputOption || 'USER_ENTERED',
        mDimension = options.majorDimension || 'COLUMNS'

    const updatePromise = this.values.update({
      spreadsheetId: this.spreadsheetId,
      range: options.range,
      valueInputOption: inputOptions,
      resource: {
        range: options.range,
        majorDimension: mDimension,
        values: options.values
      }
    })

    return updatePromise
  }
}

module.exports = SheetsService;
