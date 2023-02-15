import AbstractAutoMessenger from '../AbstractAutoMessenger';
import TimeCollection from '../../db/firestore/collectionManagers/implementations/TimeCollection';
import RenderedScheduleSheet from '../../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet';

export default abstract class ScheduleMessenger extends AbstractAutoMessenger {
  protected readonly timeCollection: TimeCollection;
  protected readonly renderedScheduleSheet: RenderedScheduleSheet;
  protected constructor() {
    super();

    this.timeCollection = TimeCollection.getInstance();
    this.renderedScheduleSheet = new RenderedScheduleSheet();
  }
}
