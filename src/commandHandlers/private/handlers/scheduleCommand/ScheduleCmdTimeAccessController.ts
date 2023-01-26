
import { DateTime } from 'luxon';
import TimeCollection from '../../../../db/firestore/collectionManagers/implementations/TimeCollection';
import cron from 'node-cron';
import AbstractTimeAccessController from '../../../../timeAccessController/AbstractTimeAccessController';
export default class ScheduleCmdTimeAccessController extends AbstractTimeAccessController {
  protected initialized: boolean;
  constructor() {
    super();
    this.initialized = false;
  }

  public override init(): void {
    if (this.initialized) return;

    this.setAccessibilityStatusOnInit();
    this.setAccessibilityModifiers();

    this.initialized = true;
  }

  protected override setAccessibilityModifiers(): void {
    const TimeDB: TimeCollection = TimeCollection.getInstance();
    const openScheduleTime: string = TimeDB.getScheduleTime('open_schedule_time');
    const closeScheduleTime: string = TimeDB.getScheduleTime('close_schedule_time');
    const timeConfig: { scheduled: boolean, timezone: string } = TimeDB.getTimeConfig('kyiv_time');

    cron.schedule(openScheduleTime, this.setAccessible.bind(this), timeConfig);
    cron.schedule(closeScheduleTime, this.setUnAccessible.bind(this), timeConfig);
  }

  protected override setAccessibilityStatusOnInit(): void {
    let accessibility = false;

    const dt: DateTime = DateTime.now();
    dt.setZone('Europe/Kiev');

    const dayNow: DateTime = DateTime.now();
    dayNow.setZone('Europe/Kiev');

    const firstWeekDay: DateTime = dt.minus({ days: dt.weekday });

    let thursday: DateTime = firstWeekDay.plus({ days: 4 });
    thursday = thursday.set({ hour: 18, minute: 0, second: 0 });

    let sunday: DateTime = firstWeekDay.plus({ days: 7 });
    sunday = sunday.set({ hour: 17, minute: 0, second: 0 });

    if (dayNow >= thursday && dayNow <= sunday) { // check if current time is between thursday and sunday. if so, schedule will be opened
      accessibility = true;
    }

    console.log(`Запис у розклад ${accessibility ? 'відкритий' : 'закритий'}`);

    this.accessible = accessibility;
  }
}
