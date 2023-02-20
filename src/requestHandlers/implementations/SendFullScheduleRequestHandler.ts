import SpreadsheetRequestObserver from '../../spreadsheetObserver/SpreadsheetRequestObserver';
import {SpreadSheetUpdateObj} from '../../spreadsheetObserver/types/types';
import {SPREADSHEET_REQUESTS} from '../../spreadsheetObserver/types/enums';
import RenderedScheduleSheetCenter
    from "../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter";
import RenderedScheduleSheet from "../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet";
import {Telegram} from "telegraf";
import {renderOneDayScheduleFromSheet} from "../../autoMessengers/scheduleMessengers.ts/helpers";
import RenderedScheduleSheetTrips
    from "../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips";

export default class SendFullScheduleRequestHandler extends SpreadsheetRequestObserver {

    private centerRenderedScheduleSheet: RenderedScheduleSheet
    private tripRenderedScheduleSheet: RenderedScheduleSheet
    private tg: Telegram
    constructor() {
        super();

        this.requestsNames = [SPREADSHEET_REQUESTS.send_full_schedule_to_tg_channel];
        this.centerRenderedScheduleSheet = new RenderedScheduleSheetCenter()
        this.tripRenderedScheduleSheet = new RenderedScheduleSheetTrips()
        this.tg = new Telegram(process.env.TELEGRAM_BOT_TOKEN as string)
    }
    public onUpdate(update: SpreadSheetUpdateObj): void {
        this.sendFullScheduleToTgChannel();
    }

    private sendFullScheduleToTgChannel(): void {
        this.sendCenterScheduleToChannel();
        this.sendTripsScheduleToChannel();
    }

    private async sendCenterScheduleToChannel(): Promise<void> {
        const centerWorkDays = await this.centerRenderedScheduleSheet.getNextWeekWorkableDaysSchedule()
        this.sendScheduleMessage(centerWorkDays, 'ЦЕНТР')
    }

    private async sendTripsScheduleToChannel(): Promise<void>  {
        const tripWorkDays = await this.tripRenderedScheduleSheet.getNextWeekWorkableDaysSchedule()
        this.sendScheduleMessage(tripWorkDays,  'ВИЇЗДИ')
    }

    private async sendScheduleMessage(workableDays: any[][], header: string): Promise<void>  {
        let finalString = ''

        for (let i = 0; i < workableDays.length; i++) {
            const day = workableDays[i]

            finalString += `${renderOneDayScheduleFromSheet(day)}\n`
        }

        finalString = finalString.replace(/^/, `${header}\n`)

        try {
            await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, finalString);
        } catch (err) {
            console.log('Error on sending everyday schedule to channel', err);
        }
    }
}