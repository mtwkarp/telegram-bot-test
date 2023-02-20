import SpreadsheetRequestObserver from '../spreadsheetObserver/SpreadsheetRequestObserver';
import SpreadsheetRequestsSubject from '../spreadsheetObserver/SpreadsheetRequestsSubject';
import SendFullScheduleRequestHandler from './implementations/SendFullScheduleRequestHandler';
import UpdateScheduleRequestHandler from "./implementations/UpdateScheduleRequestHandler";


export default class RequestHandlersManager {
    initSpreadsheetRequestHandlers(SpreadsheetRequestObserver: SpreadsheetRequestsSubject) {
        const handlers: Array<new() => SpreadsheetRequestObserver> = [
            SendFullScheduleRequestHandler,
            UpdateScheduleRequestHandler
        ];

        handlers.forEach(H => {
            const RequestObserver = new H();
            SpreadsheetRequestObserver.registerObserver(RequestObserver);
        });
    }
}