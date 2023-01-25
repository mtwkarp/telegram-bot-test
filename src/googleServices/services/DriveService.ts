import {GoogleServiceInterface} from "../ts/g_services_interfaces";
import {GoogleAuth} from "google-auth-library";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";
export default class DriveService implements GoogleServiceInterface {

  initService(authenticationObj: GoogleAuth<JSONClient>): void {
  }
}

