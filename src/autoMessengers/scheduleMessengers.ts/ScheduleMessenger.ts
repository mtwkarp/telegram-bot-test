import AbstractAutoMessenger from '../AbstractAutoMessenger';
import TimeCollection from '../../db/firestore/collectionManagers/implementations/TimeCollection';
import RenderedScheduleSheetCenter from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter';

export default abstract class ScheduleMessenger extends AbstractAutoMessenger {
  protected readonly timeCollection: TimeCollection;
  protected constructor() {
    super();

    this.timeCollection = TimeCollection.getInstance();
  }
}
