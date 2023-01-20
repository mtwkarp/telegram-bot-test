import {GoogleServiceInterface} from "../types";
import {GoogleAuth} from "google-auth-library";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";
export default class DriveService implements GoogleServiceInterface {

  initService(authenticationObj: GoogleAuth<JSONClient>): void {
  }
}

