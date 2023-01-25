import EnvLoader from "./envLoader/EnvLoader";
import TelegrafBot from "./TelegrafBot";
import PrivateScopeManager from "./user/PrivateScopeManager";
import PrivateUpdateSubject from "./tglib/botUpdatesObservers/PrivateUpdateSubject";
import {PRIVATE_UPDATE_TYPES} from "./tglib/tgTypes/botUpdatesTypes";
import DataBaseManager from "./db/DataBaseManager";
import GoogleServicesManager from "./googleServices/GoogleServicesManager";
import {sheets_v4} from "googleapis";
import Sheets = sheets_v4.Sheets;
import SheetsService from "./googleServices/services/SheetsService";
import SheetsCollection from "./db/firestore/collectionManagers/implementations/SheetsCollection";
import InstructorsAvailabilitySheet
    from "./googleServices/gsheets/scheduleSheet/scheduleSheets/InstructorsAvailabilitySheet";
import ScheduleCmdTimeAccessController
    from "./commandHandlers/private/handlers/scheduleCommand/ScheduleCmdTimeAccessController";

export default class MyBot {
    public bot: TelegrafBot
    private privateUpdateSubject: PrivateUpdateSubject
    private userScopeManager: PrivateScopeManager
    private readonly privateMessagesTypes: PRIVATE_UPDATE_TYPES[]
    private readonly privateCommands: string[]
    constructor(privateMessagesTypes: PRIVATE_UPDATE_TYPES[], privateCommands: string[]) {
        this.privateMessagesTypes = privateMessagesTypes
        this.privateCommands = privateCommands
    }
    public async init(): Promise<void> {
        this.initEnvironmentVariables();
        await this.initDatabase()
        await this.initGoogleServices()
        await this.initBot()
        this.initPrivateUpdateSubject()
        this.initUserScopeManager()
        this.subscribeForPrivateMessagesUpdates()
    }

    private async initGoogleServices(): Promise<void> {
        const googleServicesManager = new GoogleServicesManager()

        await googleServicesManager.authorize()
        const timer = new ScheduleCmdTimeAccessController()
        timer.init()
        // console.log(timer.accessible)
        // const instructorsSheet = new InstructorsAvailabilitySheet()
        // const instructorsResult = await instructorsSheet.getInstructorsChatIdsWithNoScheduleResponse()
        // console.log(instructorsResult)
        // const mondayCell = 'C'
        // const notAvailableCell = 'J'
        // const sheetName = SheetsCollection.getInstance().getSheetName( 'instructors_availability')
        // const getRange = `${sheetName}!${mondayCell}2:${notAvailableCell}`
        // const sheet = new SheetsService(process.env.SCHEDULE_SPREADSHEET_ID as string)
        // const data = await sheet.getSheetValues({range: getRange})
        //
        // for (let i = 0; i < data.length; i++) {
        //     const row = data[i]
        //
        //     for (let j = 0; j < row.length; j++) {
        //         row[j] = 'FALSE'
        //     }
        // }
        //
        // const writeRange = `${sheetName}!${mondayCell}2:${notAvailableCell}${data.length + 1}`
        //
        // const response = await sheet.updateSheetValues({range: writeRange, values: data, majorDimension: 'ROWS'})
        // console.log(response)
    }

    private async initDatabase(): Promise<void> {
        const databaseManager = new DataBaseManager()

        await databaseManager.init()
    }
    private async initBot(): Promise<void> {
        this.bot = new TelegrafBot()
        await this.bot.initBot()
        await this.bot.launchBot()
    }

    private initEnvironmentVariables():void {
        EnvLoader.load()
    }

    private initUserScopeManager() {
        this.userScopeManager = new PrivateScopeManager()
    }
    private initPrivateUpdateSubject() {
        console.log('Private messages types: ', ...this.privateMessagesTypes)
        this.privateUpdateSubject = new PrivateUpdateSubject(this.privateMessagesTypes, this.privateCommands)
        this.privateUpdateSubject.subscribeForBotUpdates(this.bot)
    }

    private subscribeForPrivateMessagesUpdates() {
        this.privateUpdateSubject.registerObserver(this.userScopeManager)
    }
}