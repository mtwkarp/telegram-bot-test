import {google, drive_v3} from 'googleapis';
import GoogleServicesManager from '../GoogleServicesManager';
export default class DriveService {

  protected readonly drive: drive_v3.Drive;
  constructor() {
    this.drive = google.drive({
      version: 'v3',
      auth: GoogleServicesManager.authenticationObject
    });
  }
}
