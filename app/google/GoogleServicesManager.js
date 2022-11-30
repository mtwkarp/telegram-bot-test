const { google } = require('googleapis');
const {sheets_service_name, drive_service_name} = require('../constants/googleServicesNames.js');
const SheetService = require('./services/SheetsService.js');
const GoogleCredentialsManager = require('./GoogleCredentialsManager.js');

class GoogleServicesManager {
  constructor() {
    this.authenticationObj = null;
    this.servicesGetterFuncs = {
      [sheets_service_name]: this.sheetsService.bind(this),
      [drive_service_name]: this.driveService.bind(this)
    };
    GoogleServicesManager.#instance = this;
  }

  async authorize() {
    const auth = await new google.auth.GoogleAuth({
      credentials: GoogleCredentialsManager.serviceAccountCredentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.authenticationObj = auth;
  }

  // serviceName refers to GoogleServicesManager._SERVICES_NAMES
  getService(serviceName) {
    if (this.servicesGetterFuncs[serviceName] === undefined) return;

    return this.servicesGetterFuncs[serviceName]();
  }

  sheetsService() {
    return new SheetService(this.authenticationObj);
  }

  static #instance = null;

  driveService() {}

  static getGoogleServiceByName(serviceName) {
    return GoogleServicesManager.#instance.getService(serviceName);
  }
}

module.exports = GoogleServicesManager;
