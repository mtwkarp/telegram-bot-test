import SpreadsheetRequestObserver from '../../spreadsheetObserver/SpreadsheetRequestObserver';
import {SpreadSheetUpdateObj} from '../../spreadsheetObserver/types/types';
import {SPREADSHEET_REQUESTS} from '../../spreadsheetObserver/types/enums';
import RenderedScheduleSheetCenter
    from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter';
import RenderedScheduleSheet from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet';
import {Telegram} from 'telegraf';
import {renderFullWorkableDaysSchedule} from '../../autoMessengers/scheduleMessengers.ts/helpers';
import RenderedScheduleSheetTrips
    from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips';
import {Message} from "typegram";
import ScheduleUpdatesCollection from "../../db/firestore/collectionManagers/implementations/ScheduleUpdatesCollection";
import {ScheduleFullMessages} from "./types/types";

export default class SendFullScheduleRequestHandler extends SpreadsheetRequestObserver {

    private centerRenderedScheduleSheet: RenderedScheduleSheet;
    private tripRenderedScheduleSheet: RenderedScheduleSheet;
    private tg: Telegram;
    constructor() {
        super();

        this.requestsNames = [SPREADSHEET_REQUESTS.send_full_schedule_to_tg_channel];
        this.centerRenderedScheduleSheet = new RenderedScheduleSheetCenter();
        this.tripRenderedScheduleSheet = new RenderedScheduleSheetTrips();
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string);
    }
    public async onUpdate(update: SpreadSheetUpdateObj): Promise<void> {
        const messages = await this.sendFullScheduleToTgChannel();
        ScheduleUpdatesCollection.getInstance().updateScheduleMessagesIdsAndAllowEdit(messages)
    }

    private async sendFullScheduleToTgChannel(): Promise<ScheduleFullMessages> {
        const fullScheduleCenterMsg = await this.sendCenterScheduleToChannel();
        const fullScheduleTripsMsg = await this.sendTripsScheduleToChannel();

        return {
            fullScheduleCenterMsg,
            fullScheduleTripsMsg
        }
    }

    private async sendCenterScheduleToChannel(): Promise<Message.TextMessage | undefined>  {
        const centerWorkDays = await this.centerRenderedScheduleSheet.getNextWeekWorkableDaysSchedule();

        return this.sendScheduleMessage(centerWorkDays, 'ЦЕНТР');
    }

    private async sendTripsScheduleToChannel(): Promise<Message.TextMessage | undefined>   {
        const tripWorkDays = await this.tripRenderedScheduleSheet.getNextWeekWorkableDaysSchedule();

        return this.sendScheduleMessage(tripWorkDays,  'ВИЇЗДИ');
    }

    private async sendScheduleMessage(workableDays: any[][], header: string): Promise<Message.TextMessage | undefined>  {
        let finalString = renderFullWorkableDaysSchedule(workableDays, header)

        if(finalString === '') {
            console.log('Empty full schedule', header)
            return
        }

        try {
            return this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, finalString);
        } catch (err) {
            console.log('Error on sending everyday schedule to channel', err);
        }
    }
}