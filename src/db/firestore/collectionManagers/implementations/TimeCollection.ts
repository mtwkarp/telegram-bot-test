import AbstractCollectionManager from '../AbstractCollectionManager';

export default class TimeCollection extends AbstractCollectionManager {
  protected constructor() {
    super('time_values');
  }

  public getScheduleTime(valueId: string): string {
    return this.getValueFromDocument('schedule', valueId);
  }

  public getTimeConfig(valueId: string): { scheduled: boolean, timezone: string } {
    return this.getValueFromDocument('time_configs', valueId);
  }

  public getMakingPhotosReminder(valueId: string): string {
    return this.getValueFromDocument('reminders', valueId);
  }

  public static getInstance(): TimeCollection {
    if (TimeCollection.uniqueInstance === null) {
      const newInstance = new TimeCollection();

      TimeCollection.uniqueInstance = newInstance;

      return newInstance;
    }

    return TimeCollection.uniqueInstance;
  }

  private static uniqueInstance: TimeCollection | null = null;
}
