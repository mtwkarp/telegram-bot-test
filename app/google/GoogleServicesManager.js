const { google } = require('googleapis');
const {sheets_service_name, drive_service_name} = require('../constants/googleServicesNames.js');
const SheetService = require('./services/SheetsService.js');

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
    const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replaceAll('\\n','\n');

    const auth = await new google.auth.GoogleAuth({
      credentials: {
        "type": process.env.SERVICE_ACCOUNT_TYPE,
        "project_id": process.env.SERVICE_ACCOUNT_PROJECT_ID,
        "private_key_id": process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
        "private_key": privateKey,
        "client_email": process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
        "client_id": process.env.SERVICE_ACCOUNT_CLIENT_ID,
        "auth_uri": process.env.SERVICE_ACCOUNT_AUTH_URI,
        "token_uri": process.env.SERVICE_ACCOUNT_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_CERT_URL,
        "client_x509_cert_url": process.env.SERVICE_ACCOUNT_CLIENT_CERT_URL
      },
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
