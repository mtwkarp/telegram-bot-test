import {IObserver} from '../tglib/lib/observer/observerTypes';
import {SpreadSheetUpdateObj} from './types/types';
import {SPREADSHEET_REQUESTS} from './types/enums';

export default abstract class SpreadsheetRequestObserver implements IObserver {

    public requestsNames: SPREADSHEET_REQUESTS[];
    protected constructor() {
        this.requestsNames = [];
    }

    public abstract onUpdate(update: SpreadSheetUpdateObj): void
}