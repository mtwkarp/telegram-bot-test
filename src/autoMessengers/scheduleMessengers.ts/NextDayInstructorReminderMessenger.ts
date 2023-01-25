import ScheduleMessenger from "./ScheduleMessenger";
import cron from "node-cron";
import DateHelper from "../../helpers/DateHelper";
import ReplyMsgCollection from "../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";
export default class NextDayInstructorReminderMessenger extends ScheduleMessenger {
    private readonly repliesCollection: ReplyMsgCollection
    constructor() {
        super();
        this.repliesCollection = ReplyMsgCollection.getInstance()
    }

    public setScheduledMessages() {
        const everyDayTeachingReminder = this.timeCollection.getScheduleTime('every_day_teaching_reminder');
        const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

        cron.schedule(everyDayTeachingReminder, this.sendTomorrowInstructorsReminders.bind(this), timeConfig);
    }
    // refactor
    private async sendTomorrowInstructorsReminders() {
        const isDayWorkable = await this.renderedScheduleSheet.isNextDayWorkable();

        if (!isDayWorkable) return;

        const tomorrowInstructorsByBase = await this.renderedScheduleSheet.getTomorrowInstructorsByBase(DateHelper.nextDayName);

        const basesTranslation: {[key: string]: string} = {
            ['blood']: 'кров🩸',
            ['lungs']: 'легені🫁',
            ['heart']: 'серце❤',
            ['evacuation']: 'евакуація🚑'
        };

        const basesByInstructor: {[key: string]: string[]} = {}

        const instructorsInfo: {[key: string]: {name: string, chatId: string}} = {}

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
            let message =this.repliesCollection.getScheduleCmdReply('every_day_instructor_reminder');
            let replace2 = ''

            if(basesByInstructor[name].length === 1) {
                message =this.repliesCollection.getScheduleCmdReply('every_day_instructor_reminder');
                replace2 = basesTranslation[basesByInstructor[name][0]];

            }else {
                message =this.repliesCollection.getScheduleCmdReply('every_day_instructor_reminder_2');
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