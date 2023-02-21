import SpreadsheetRequestObserver from '../spreadsheetObserver/SpreadsheetRequestObserver';
import SpreadsheetRequestsSubject from '../spreadsheetObserver/SpreadsheetRequestsSubject';
import SendFullScheduleRequestHandler from './implementations/SendFullScheduleRequestHandler';
import CenterScheduleUpdateHandler from "./implementations/updateScheduleRequestHandlers/CenterScheduleUpdateHandler";
import TripsScheduleUpdateHandler from "./implementations/updateScheduleRequestHandlers/TripsScheduleUpdateHandler";


export default class RequestHandlersManager {
    initSpreadsheetRequestHandlers(SpreadsheetRequestObserver: SpreadsheetRequestsSubject) {
        const handlers: Array<new() => SpreadsheetRequestObserver> = [
            SendFullScheduleRequestHandler,
            CenterScheduleUpdateHandler,
            TripsScheduleUpdateHandler
        ];

        handlers.forEach(H => {
            const RequestObserver = new H();
            SpreadsheetRequestObserver.registerObserver(RequestObserver);
        });
    }
}