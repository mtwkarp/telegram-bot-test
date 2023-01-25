import ScheduleMessenger from "./ScheduleMessenger";

import cron from "node-cron";
import ReplyMsgCollection from "../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";
import InstructorsAvailabilitySheet
    from "../../googleServices/gsheets/scheduleSheet/scheduleSheets/InstructorsAvailabilitySheet";
export default class ScheduleEnrolmentMessenger extends ScheduleMessenger {

    protected readonly repliesCollection: ReplyMsgCollection
    protected readonly instructorsAvailabilitySheet: InstructorsAvailabilitySheet
    constructor() {
        super();
        this.repliesCollection = ReplyMsgCollection.getInstance()
        this.instructorsAvailabilitySheet = new InstructorsAvailabilitySheet()
    }

    setScheduledMessages() {
        this.setPrivateMsgScheduleReminders();
        this.setChannelScheduleReminder();
    }

    setPrivateMsgScheduleReminders() {
        const privateMsgScheduleReminder1 = this.timeCollection.getScheduleTime('private_msg_schedule_reminder_1');
        const privateMsgScheduleReminder2 = this.timeCollection.getScheduleTime('private_msg_schedule_reminder_2');
        const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(privateMsgScheduleReminder1, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
        cron.schedule(privateMsgScheduleReminder2, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
    }

    setChannelScheduleReminder() {
        const channelScheduleReminder1 = this.timeCollection.getScheduleTime('channel_schedule_reminder_1');
        const channelScheduleReminder2 = this.timeCollection.getScheduleTime('channel_schedule_reminder_2');
        const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(channelScheduleReminder1, this.sendFirstScheduleStartReminderToChannel.bind(this), timeConfig);
        cron.schedule(channelScheduleReminder2, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
    }

    async sendScheduleStartPrivateReminders() {
        const noResponseInstructors = await this.instructorsAvailabilitySheet.getInstructorsChatIdsWithNoScheduleResponse(); // {chatId, name}

        for (let i = 0; i < noResponseInstructors.length; i++) {
            const {chatId, fullName} = noResponseInstructors[i];
            let surname = fullName.split(' ')[1];

            if (surname === undefined) surname = fullName.split(' ')[0];

            let message = this.repliesCollection.getScheduleCmdReply( 'private_schedule_reminder');
            message = message.replace('$1', surname);

            try {
                await this.tg.sendMessage(chatId, message);
            } catch (err) {
                // console.log(err);
            }
        }
    }

    sendScheduleStartReminderToChannel() {
        this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, this.repliesCollection.getScheduleCmdReply('channel_schedule_reminder'));
    }

    async sendFirstScheduleStartReminderToChannel() {
        await this.instructorsAvailabilitySheet.clearAllPreviousScheduleReplies()
        this.sendScheduleStartReminderToChannel()
    }
}

module.exports = ScheduleEnrolmentMessenger;
