import SpreadsheetRequestObserver from '../spreadsheetObserver/SpreadsheetRequestObserver';
import SpreadsheetRequestsSubject from '../spreadsheetObserver/SpreadsheetRequestsSubject';
import SendFullScheduleRequestHandler from './implementations/SendFullScheduleRequestHandler';


export default class RequestHandlersManager {
    initSpreadsheetRequestHandlers(SpreadsheetRequestObserver: SpreadsheetRequestsSubject) {
        const handlers: Array<new() => SpreadsheetRequestObserver> = [SendFullScheduleRequestHandler];

        handlers.forEach(H => {
            const RequestObserver = new H();
            SpreadsheetRequestObserver.registerObserver(RequestObserver);
        });
    }
}