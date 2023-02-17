import ScheduleMessenger from '../ScheduleMessenger';
import cron from 'node-cron';
import DateHelper from '../../../helpers/DateHelper';
import ReplyMsgCollection from '../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';
import {renderNextDayInstructorReminderMessage} from "../helpers";
export default class NextDayCenterInstructorReminder extends ScheduleMessenger {
  private readonly repliesCollection: ReplyMsgCollection;
  constructor() {
    super();
    this.repliesCollection = ReplyMsgCollection.getInstance();
  }

  public setScheduledMessages() {
    const everyDayTeachingReminder = this.timeCollection.getScheduleTime('every_day_teaching_reminder');
    const timeConfig = this.timeCollection.getTimeConfig('kyiv_time');

    cron.schedule(everyDayTeachingReminder, this.sendTomorrowInstructorsReminders.bind(this), timeConfig);
  }

  private prepareMessages(messagesArr: {chatId: string, message: string}[]): void {
    messagesArr.forEach(el => {
      el.message = el.message.replace(/^/, '(ЦЕНТР)\n')
    })
  }
  private async sendTomorrowInstructorsReminders() {
    const isDayWorkable = await this.renderedScheduleSheet.isCenterNextDayWorkable();

    if (!isDayWorkable) return;

    const tomorrowInstructorsByBase: Record<string, Array<{ name: string, chatId: string }>> = await this.renderedScheduleSheet.getTomorrowCenterInstructorsByBase(DateHelper.nextDayName);

    const messagesArr: {chatId: string, message: string}[] = renderNextDayInstructorReminderMessage(tomorrowInstructorsByBase, this.repliesCollection)

    this.prepareMessages(messagesArr)

    for (let i = 0; i < messagesArr.length; i++) {
      const {chatId, message} = messagesArr[i]

      try {
        await this.tg.sendMessage(chatId, message);
      } catch (err) {
        // console.log(err);
      }
    }
  }
}
