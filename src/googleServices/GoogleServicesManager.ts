import {GoogleAuth} from "google-auth-library";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";
import GoogleServicesNames from "./googleServicesNames";
import GoogleCredentialsManager from "../helpers/GoogleCredentialsManager";
import GoogleServicesFabric from "./GoogleServicesFabric";

export default class GoogleServicesManager {
    // private authenticationObj: GoogleAuth<JSONClient>
    // private servicesFabric: GoogleServicesFabric

    constructor() {
        if(GoogleServicesManager.instance !== null) {
            return GoogleServicesManager.instance
        }

        // this.servicesFabric = new GoogleServicesFabric()

        GoogleServicesManager.instance = this
    }

    public async authorize(): Promise<void> {
        // if(this.authenticationObj) return

        // this.authenticationObj =
        GoogleServicesManager.authObj = await new GoogleAuth({
            credentials: GoogleCredentialsManager.serviceAccountCredentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        // this.servicesFabric.setAuthObject(this.authenticationObj)
        // this.getService(GoogleServicesNames.sheets)
    }

    // public getService(serviceName: GoogleServicesNames) {
    //     return this.servicesFabric.getService(serviceName);
    // }

    private static instance: GoogleServicesManager | null = null;

    private static authObj: GoogleAuth<JSONClient>

    public static get authenticationObject() {
        return GoogleServicesManager.authObj
    }
}
