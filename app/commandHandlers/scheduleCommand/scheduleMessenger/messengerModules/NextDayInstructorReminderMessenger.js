const MessengerModule = require('./MessengerModule');
const cron = require('node-cron');
const DateHelper = require('../../../../helpers/DateHelper');
const FirebaseDB = require('../../../../google/FireStoreDB');

class NextDayInstructorReminderMessenger extends MessengerModule {
  constructor(tg, scheduleSheetsManager) {
    super(tg, scheduleSheetsManager);
  }

  setScheduledMessages() {
    const everyDayTeachingReminder = FirebaseDB.getTimeValueData('schedule', 'every_day_teaching_reminder');
    const timeConfig = FirebaseDB.getTimeValueData('time_configs', 'kyiv_time');

    cron.schedule(everyDayTeachingReminder, this.sendTomorrowInstructorsReminders.bind(this), timeConfig);
  }
  // refactor
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

    const basesByInstructor = {}

    const instructorsInfo = {}

    for (const baseName in tomorrowInstructorsByBase) {
      const instructorsData = tomorrowInstructorsByBase[baseName];

      for (let i = 0; i < instructorsData.length; i++) {
        const {name} = instructorsData[i];

        if(instructorsInfo[name] === undefined) instructorsInfo[name] = instructorsData[i]
        if(basesByInstructor[name] === undefined) basesByInstructor[name] = []

        basesByInstructor[name].push(baseName)
      }
    }

    for (const instructorName in instructorsInfo) {
      const instructorsData = instructorsInfo[instructorName];

        const {chatId, name} = instructorsData;
        let firstName = name.split(' ')[1];

        if (firstName === undefined) firstName = name.split(' ')[0];
        let message = FirebaseDB.getReplyMessage('schedule', 'every_day_instructor_reminder');
        let replace2 = ''

        if(basesByInstructor[name].length === 1) {
          message = FirebaseDB.getReplyMessage('schedule', 'every_day_instructor_reminder');
          replace2 = basesTranslation[basesByInstructor[name][0]];

        }else {
          message = FirebaseDB.getReplyMessage('schedule', 'every_day_instructor_reminder_2');
          for (let j = 0; j < basesByInstructor[name].length; j++) {
            const instructorBase = basesByInstructor[name][j]
            const baseLabel = basesTranslation[instructorBase]

            replace2 += `\n- ${baseLabel}`
          }
        }

        message = message.replace('$1', firstName);
        message = message.replace('$2', replace2);

        try {
          await this.tg.sendMessage(chatId, message);
        } catch (err) {
          console.log(err);
        }
      }
  }
}

module.exports = NextDayInstructorReminderMessenger;
