const MessengerModule = require("./MessengerModule");
const cron = require("node-cron");
const DateHelper = require("../../../../helpers/DateHelper");
const FirebaseDB = require("../../../../FireStoreDB");

class NextDayInstructorReminderMessenger extends MessengerModule {
    constructor(tg, scheduleSheetsManager) {
        super(tg, scheduleSheetsManager);
    }

    setScheduledMessages() {
        const everyDayTeachingReminder = FirebaseDB.getTimeValueData('schedule', 'every_day_teaching_reminder'),
            timeConfig = FirebaseDB.getTimeValueData('time_configs', 'kyiv_time')

        cron.schedule(everyDayTeachingReminder, this.sendTomorrowInstructorsReminders.bind(this), timeConfig);
    }
//refactor
    async sendTomorrowInstructorsReminders() {
        const isDayWorkable = await this.scheduleSheetsManager.isNextDayWorkable();

        if (isDayWorkable === false) return;

        const tomorrowInstructorsByBase = await this.scheduleSheetsManager.getTomorrowInstructorsByBase(DateHelper.nextDayName);

        const basesTranslation = {
            ['blood']: 'кров🩸',
            ['lungs']: 'легені🫁',
            ['heart']: 'серце❤',
            ['evacuation']: 'евакуація🚑'
        };

        for (const baseName in tomorrowInstructorsByBase) {
            const instructorsData = tomorrowInstructorsByBase[baseName];

            for (let i = 0; i < instructorsData.length; i++) {
                const {chatId, name} = instructorsData[i];
                let firstName = name.split(' ')[1];

                if (firstName === undefined) firstName = name.split(' ')[0];

                let message = FirebaseDB.getReplyMessage('schedule', 'every_day_instructor_reminder')

                message = message.replace('$1', firstName)
                message = message.replace('$2', basesTranslation[baseName])

                try {
                    await this.tg.sendMessage(chatId, message);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}

module.exports = NextDayInstructorReminderMessenger