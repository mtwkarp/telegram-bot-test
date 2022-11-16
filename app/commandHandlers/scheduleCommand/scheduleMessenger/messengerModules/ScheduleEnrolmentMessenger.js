const MessengerModule = require("./MessengerModule");
const cron = require("node-cron");
const {
    privateMsgScheduleReminder1,
    timeConfig,
    privateMsgScheduleReminder2, channelScheduleReminder1, channelScheduleReminder2
} = require("../../../../constants/timeConstants");
const replyMessages = require("../../../../constants/replyMessages");

class ScheduleEnrolmentMessenger extends MessengerModule {
    constructor(tg, scheduleSheetsManager) {
        super(tg, scheduleSheetsManager);
    }

    setScheduledMessages() {
        this.setPrivateMsgScheduleReminders()
        this.setChannelScheduleReminder()
    }

    setPrivateMsgScheduleReminders() {
        cron.schedule(privateMsgScheduleReminder1, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
        cron.schedule(privateMsgScheduleReminder2, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
    }

    setChannelScheduleReminder() {
        cron.schedule(channelScheduleReminder1, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
        cron.schedule(channelScheduleReminder2, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
    }

    async sendScheduleStartPrivateReminders() {
        const noResponseInstructors = await this.scheduleSheetsManager.getInstructorsChatIdsWithNoScheduleResponse(); // {chatId, name}

        for (let i = 0; i < noResponseInstructors.length; i++) {
            const {chatId, name} = noResponseInstructors[i];
            let surname = name.split(' ')[1];

            if (surname === undefined) surname = name.split(' ')[0];
            try {
                await this.tg.sendMessage(chatId, replyMessages.schedule.privateScheduleReminder(surname));
            } catch (err) {
                console.log(err);
            }
        }
    }

    sendScheduleStartReminderToChannel() {
        this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID, replyMessages.schedule.channelScheduleReminder);
    }
}

module.exports = ScheduleEnrolmentMessenger