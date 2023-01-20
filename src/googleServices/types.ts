import {GoogleAuth} from "google-auth-library";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";
import GoogleServicesNames from "./googleServicesNames";
export interface GoogleServiceInterface {
    initService(authenticationObj: GoogleAuth<JSONClient>): void
}

export type GOOGLE_SERVICES_CREATORS_HOLDER = {
    [key in GoogleServicesNames]: () => GoogleServiceInterface
};