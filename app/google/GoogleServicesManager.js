const { google } = require("googleapis");
const {
  sheets_service_name,
  drive_service_name,
} = require("../constants/googleServicesNames.js");
const SheetService = require("./services/SheetsService.js");

class GoogleServicesManager {
  constructor() {
    this.authenticationObj = null;
    this.servicesGetterFuncs = {
      [sheets_service_name]: this.sheetsService.bind(this),
      [drive_service_name]: this.driveService.bind(this),
    };
  }

  async init() {
    await this.authorize();
  }

  async authorize() {
    const auth = await new google.auth.GoogleAuth({
      keyFile: process.env.SERVICE_ACCOUNT_CREDENTIALS_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })

    this.authenticationObj = auth;
  }

  getServicesObjByNames(names = []) {
    const servicesObj = {};

    names.forEach((name) => {
      const service = this.getService(name);

      if (service !== undefined) {
        servicesObj[name] = service;
      }
    });

    return servicesObj;
  }

  //serviceName referse to GoogleServicesManager._SERVICES_NAMES
  getService(serviceName) {
    if (this.servicesGetterFuncs[serviceName] === undefined) return;

    return this.servicesGetterFuncs[serviceName]();
  }

  sheetsService() {
    return new SheetService(this.authenticationObj);
  }

  driveService() {}
}

module.exports = GoogleServicesManager;
