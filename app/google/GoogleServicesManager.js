const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const path = require("path");
const process = require("process");
const fs = require("fs").promises;
const {
  sheets_service_name,
  drive_service_name,
} = require("../constants/googleServicesNames.js");
const SheetService = require("./services/SheetsService.js");
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = path.join(process.cwd(), "app/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "app/credentials.json");
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
    let cl = await this.loadSavedCredentialsIfExist();
    // console.log(process.env)
    if (cl) {
      this.authenticationObj = cl;
      return;
    }
    cl = await authenticate({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      keyfilePath: CREDENTIALS_PATH,
    });
    if (cl.credentials) {
      await this.saveCredentials(cl);
    }
    this.authenticationObj = cl;
  }

  async saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  async loadSavedCredentialsIfExist() {
    try {
      // const content = await fs.readFile(TOKEN_PATH);
      // const credentials = JSON.parse(content);
      // const content = await fs.readFile(TOKEN_PATH);
      return google.auth.fromJSON({
        type: process.env.GOOGLE_API_TYPE,
        client_id: process.env.GOOGLE_API_CLIENT_ID,
        client_secret: process.env.GOOGLE_API_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN,
      });
    } catch (err) {
      return null;
    }
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
