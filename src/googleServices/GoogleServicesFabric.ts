import {GOOGLE_SERVICES_CREATORS_HOLDER, GoogleServiceInterface} from "./types";
import SheetsService from "./services/SheetsService";
import GoogleServicesNames from "./googleServicesNames";
import {GoogleAuth} from "google-auth-library";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";

export default class GoogleServicesFabric {
    private readonly servicesGetters: GOOGLE_SERVICES_CREATORS_HOLDER
    private authenticationObj: GoogleAuth<JSONClient>
    constructor() {
        this.servicesGetters = {
            [GoogleServicesNames.sheets]: this.sheetsService.bind(this),
            // [GoogleServicesNames.drive]: this.driveService.bind(this)
        };
    }

    public setAuthObject(authObj: GoogleAuth<JSONClient>): void {
        this.authenticationObj = authObj
    }

    public getService(serviceName: GoogleServicesNames): GoogleServiceInterface {
        return this.servicesGetters[serviceName]();
    }

    private sheetsService(): GoogleServiceInterface {
        return this.createService(SheetsService)
    }

    private createService(Service: {new (): GoogleServiceInterface}): GoogleServiceInterface {
        const service: GoogleServiceInterface = new Service()

        service.initService(this.authenticationObj)

        return service
    }
}