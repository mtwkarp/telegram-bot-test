import {SPREADSHEET_REQUESTS} from './types/enums';
import {SpreadSheetUpdateObj} from './types/types';
import SpreadsheetRequestObserver from './SpreadsheetRequestObserver';

export default class SpreadsheetRequestsSubject {
    private readonly requestObservers: {[index: string]: SpreadsheetRequestObserver[]};
    constructor() {
        this.requestObservers = {};
    }

    private createRequestObserversArr(requestName: SPREADSHEET_REQUESTS) {
        this.requestObservers[requestName] = [];
    }

    public registerObserver(observer: SpreadsheetRequestObserver): void {
        observer.requestsNames.forEach(requestName => {
            if(this.requestObservers[requestName] === undefined) this.createRequestObserversArr(requestName);

            const requestObservers = this.requestObservers[requestName];

            if (!requestObservers.includes(observer)) {
                requestObservers.push(observer);
            } else {
                console.warn('This observer already registered');
            }
        });

        // console.log(this.requestObservers)
    }

    public removeObserver(observer: SpreadsheetRequestObserver): void {
        observer.requestsNames.forEach(requestName => {
            const requestObservers = this.requestObservers[requestName];

            if (requestObservers.includes(observer)) {
                requestObservers.splice(requestObservers.indexOf(observer), 1);
            } else {
                console.warn('No such observer you are trying to delete');
            }
        });
    }

    public notifyObservers(requestName: SPREADSHEET_REQUESTS, updateObj: SpreadSheetUpdateObj): void {
        if(this.requestObservers[requestName] === undefined) return;
        this.requestObservers[requestName].forEach(o => o.onUpdate(updateObj));
    }
}