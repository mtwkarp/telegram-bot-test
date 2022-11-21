const MessengerModule = require("./MessengerModule");
const cron = require("node-cron");
const FirebaseDB = require('../../../../FireStoreDB.js')

class ScheduleEnrolmentMessenger extends MessengerModule {
    constructor(tg, scheduleSheetsManager) {
        super(tg, scheduleSheetsManager);
    }

    setScheduledMessages() {
        this.setPrivateMsgScheduleReminders()
        this.setChannelScheduleReminder()
    }

    setPrivateMsgScheduleReminders() {
        const privateMsgScheduleReminder1 = FirebaseDB.getTimeValueData('schedule', 'private_msg_schedule_reminder_1'),
            privateMsgScheduleReminder2 = FirebaseDB.getTimeValueData('schedule', 'private_msg_schedule_reminder_1'),
            timeConfig = FirebaseDB.getTimeValueData('time_configs', 'kyiv_time')

        cron.schedule(privateMsgScheduleReminder1, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
        cron.schedule(privateMsgScheduleReminder2, this.sendScheduleStartPrivateReminders.bind(this), timeConfig);
    }

    setChannelScheduleReminder() {
        const channelScheduleReminder1 = FirebaseDB.getTimeValueData('schedule', 'channel_schedule_reminder_1'),
            channelScheduleReminder2 = FirebaseDB.getTimeValueData('schedule', 'channel_schedule_reminder_2'),
            timeConfig = FirebaseDB.getTimeValueData('time_configs', 'kyiv_time')

        cron.schedule(channelScheduleReminder1, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
        cron.schedule(channelScheduleReminder2, this.sendScheduleStartReminderToChannel.bind(this), timeConfig);
    }

    async sendScheduleStartPrivateReminders() {
        const noResponseInstructors = await this.scheduleSheetsManager.getInstructorsChatIdsWithNoScheduleResponse(); // {chatId, name}

        for (let i = 0; i < noResponseInstructors.length; i++) {
            const {chatId, name} = noResponseInstructors[i];
            let surname = name.split(' ')[1];

            if (surname === undefined) surname = name.split(' ')[0];

            let message = FirebaseDB.getReplyMessage('schedule', 'private_schedule_reminder')
            message = message.replace('$1', surname)

            try {
                await this.tg.sendMessage(chatId, message);
            } catch (err) {
                console.log(err);
            }
        }
    }

    sendScheduleStartReminderToChannel() {
        this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID, FirebaseDB.getReplyMessage('schedule', 'channel_schedule_reminder'));
    }
}

module.exports = ScheduleEnrolmentMessenger