import EnvLoader from './envLoader/EnvLoader';
import TelegrafBot from './TelegrafBot';
import PrivateScopeManager from './user/PrivateScopeManager';
import PrivateUpdateSubject from './tglib/botUpdatesObservers/PrivateUpdateSubject';
import { type PRIVATE_UPDATE_TYPES } from './tglib/tgTypes/botUpdatesTypes';
import DataBaseManager from './db/DataBaseManager';
import GoogleServicesManager from './googleServices/GoogleServicesManager';
import AutoMessengersController from './autoMessengers/AutoMessengersController';
import ServerExpress from './expressServer/ServerExpress';
import SpreadsheetRequestsSubject from './spreadsheetObserver/SpreadsheetRequestsSubject';
import RequestHandlersManager from './requestHandlers/RequestHandlersManager';
export default class MyBot {
  public bot: TelegrafBot;
  private privateUpdateSubject: PrivateUpdateSubject;
  private userScopeManager: PrivateScopeManager;
  private readonly privateMessagesTypes: PRIVATE_UPDATE_TYPES[];
  private readonly privateCommands: string[];
  private readonly spreadsheetRequestSubject: SpreadsheetRequestsSubject;
  private readonly expressServer: ServerExpress;
  private readonly requestHandlersManager: RequestHandlersManager;
  constructor(privateMessagesTypes: PRIVATE_UPDATE_TYPES[], privateCommands: string[]) {
    this.privateMessagesTypes = privateMessagesTypes;
    this.privateCommands = privateCommands;
    this.spreadsheetRequestSubject = new SpreadsheetRequestsSubject();
    this.expressServer = new ServerExpress();
    this.requestHandlersManager = new RequestHandlersManager();
  }

  public async init(): Promise<void> {
    this.initEnvironmentVariables();
    await this.initDatabase();
    await this.initGoogleServices();
    await this.initBot();
    this.initAutoMessenger();
    this.initPrivateUpdateSubject();
    this.initUserScopeManager();
    this.subscribeForPrivateMessagesUpdates();
    this.subscribeSpreadsheetRequestSubjectForServerUpdates();
    this.subscribeRequestHandlers();
  }

  private subscribeRequestHandlers() {
    this.requestHandlersManager.initSpreadsheetRequestHandlers(this.spreadsheetRequestSubject);
  }

  private subscribeSpreadsheetRequestSubjectForServerUpdates() {
    this.expressServer.subscribeSpreadSheetRequestSubject(this.spreadsheetRequestSubject);
  }

  private initAutoMessenger() {
    const autoMessenger = new AutoMessengersController();

    autoMessenger.initMessengerModules();
  }

  private async initGoogleServices(): Promise<void> {
    const googleServicesManager = new GoogleServicesManager();

    await googleServicesManager.authorize();
  }

  private async initDatabase(): Promise<void> {
    const databaseManager = new DataBaseManager();

    await databaseManager.init();
  }

  private async initBot(): Promise<void> {
    this.bot = new TelegrafBot();
    await this.bot.initBot();
    await this.bot.launchBot();
  }

  private initEnvironmentVariables(): void {
    EnvLoader.load();
  }

  private initUserScopeManager() {
    this.userScopeManager = new PrivateScopeManager();
  }

  private initPrivateUpdateSubject() {
    this.privateUpdateSubject = new PrivateUpdateSubject(this.privateMessagesTypes, this.privateCommands);
    this.privateUpdateSubject.subscribeForBotUpdates(this.bot);
  }

  private subscribeForPrivateMessagesUpdates() {
    this.privateUpdateSubject.registerObserver(this.userScopeManager);
  }
}
