const GoogleService = require('./GoogleServiceInterface.js');
const { google } = require('googleapis');

class SheetsService extends GoogleService {
  constructor(authenticationObj) {
    super(authenticationObj);

    this.spreadsheet = null;
    this.values = null;

    this.initService(authenticationObj);
  }

  initService(authenticationObj) {
    this.spreadsheet = google.sheets({
      version: 'v4',
      auth: authenticationObj
    });

    this.values = this.spreadsheet.spreadsheets.values
  }
}

module.exports = SheetsService;
