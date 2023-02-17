import InstructorsAvailabilitySheet from './scheduleSheets/InstructorsAvailabilitySheet';
import RenderedScheduleSheetCenter from './scheduleSheets/RenderedScheduleSheetCenter';

// FACADE pattern
export default class ScheduleSpreadSheet {
  private readonly instructorsAvailabilitySheet: InstructorsAvailabilitySheet;
  private readonly renderedScheduleSheet: RenderedScheduleSheetCenter;
  constructor() {
    this.instructorsAvailabilitySheet = new InstructorsAvailabilitySheet();
    this.renderedScheduleSheet = new RenderedScheduleSheetCenter();
  }
}
