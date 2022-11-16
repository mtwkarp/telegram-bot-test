const MessengerModule = require("./MessengerModule");
const cron = require("node-cron");
const {everyDayTeachingReminder, timeConfig} = require("../../../../constants/timeConstants");
const DateHelper = require("../../../../helpers/DateHelper");
const replyMessages = require("../../../../constants/replyMessages");

class NextDayInstructorReminderMessenger extends MessengerModule {
    constructor(tg, scheduleSheetsManager) {
        super(tg, scheduleSheetsManager);
    }

    setScheduledMessages() {
        cron.schedule(everyDayTeachingReminder, this.sendTomorrowInstructorsReminders.bind(this), timeConfig);
    }

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

                try {
                    await this.tg.sendMessage(chatId, replyMessages.schedule.everyDayInstructorReminder(basesTranslation[baseName], firstName));
                } catch (err) {
                    console.log(err);
                }
            }
        }
    }
}

module.exports = NextDayInstructorReminderMessenger