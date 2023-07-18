import AbstractTeachingTracker from './AbstractTeachingTracker';
import RenderedScheduleSheetCenter
    from '../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheetCenter';
import RenderedScheduleSheet from '../googleServices/gsheets/scheduleSheet/scheduleSheets/RenderedScheduleSheet';


export default class CenterTracker extends AbstractTeachingTracker {

    protected readonly renderedScheduleSheet: RenderedScheduleSheet;

    constructor() {
        super('Центр звітність ');

        this.renderedScheduleSheet = new RenderedScheduleSheetCenter();
    }
}