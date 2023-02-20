import RenderedScheduleSheet from "./RenderedScheduleSheet";

export default class RenderedScheduleSheetCenter extends RenderedScheduleSheet {
  constructor() {
    super();

    this.renderedSheetName = 'schedule_rendered'
    this.instructorsByBaseSheetName = 'instructors_by_bases_schedule'
  }
}
