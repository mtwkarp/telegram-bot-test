import ScheduleMessenger from "../ScheduleMessenger";
import ReplyMsgCollection from "../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";
import RenderedScheduleSheetCenter
    from "../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter";
import RenderedScheduleSheetTrips
    from "../../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetTrips";
import cron from "node-cron";
import UsersCollection from "../../../db/firestore/collectionManagers/implementations/UsersCollection";

export default class MakePhotosReminder extends ScheduleMessenger {
    protected readonly centerRenderedScheduleSheet: RenderedScheduleSheetCenter;
    private readonly tripRenderedScheduleSheet: RenderedScheduleSheetTrips;
    constructor() {
        super();
        this.centerRenderedScheduleSheet = new RenderedScheduleSheetCenter();
        this.tripRenderedScheduleSheet = new RenderedScheduleSheetTrips();
    }

    setScheduledMessages(): void {
        const firstReminder = this.timeCollection.getMakingPhotosReminder('make_photos_first_reminder');
        const secondReminder = this.timeCollection.getMakingPhotosReminder('make_photos_second_reminder');
        const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(firstReminder, this.notifyInstructorsToMakePictures.bind(this), timeConfig);
        cron.schedule(secondReminder, this.notifyInstructorsToSendPictures.bind(this), timeConfig);

    }

    private async getAllTodayInstructorsIds(): Promise<string[]> {
        const centerInstructors = await this.centerRenderedScheduleSheet.getTodayInstructors()
        const tripInstructors = await this.tripRenderedScheduleSheet.getTodayInstructors()
        const allInstructors = [...centerInstructors, ...tripInstructors]
        const instructorIds: string[] = []

        allInstructors.forEach(name => {
            const id = UsersCollection.getInstance().getUserId(name)

            if(id) {
                instructorIds.push(id)
            }
        })

        return instructorIds
    }
    private async notifyInstructorsToMakePictures(): Promise<void> {
        const message = ReplyMsgCollection.getInstance().getMakingPhotosReply('second_reminder');

        await this.notifyInstructors(message)
    }

    private async notifyInstructorsToSendPictures(): Promise<void> {
        const message = ReplyMsgCollection.getInstance().getMakingPhotosReply('first_reminder');

        await this.notifyInstructors(message)
    }

    private async notifyInstructors(message: string): Promise<void> {
        const instructorIds = await this.getAllTodayInstructorsIds()

        for (let i = 0; i < instructorIds.length; i++) {
            try {
                await this.tg.sendMessage(instructorIds[i], message);
            } catch (err) {
                console.log(err);
            }
        }
    }
}
