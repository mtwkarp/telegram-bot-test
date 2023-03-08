import { GoogleAuth } from 'google-auth-library';
import { type JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import GoogleCredentialsManager from '../helpers/GoogleCredentialsManager';

export default class GoogleServicesManager {
  constructor() {
    if (GoogleServicesManager.instance !== null) {
      return GoogleServicesManager.instance;
    }

    GoogleServicesManager.instance = this;
  }

  public async authorize(): Promise<void> {
    if (GoogleServicesManager.authObj) return;

    GoogleServicesManager.authObj = await new GoogleAuth({
      credentials: GoogleCredentialsManager.serviceAccountCredentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    });
  }

  private static instance: GoogleServicesManager | null = null;

  private static authObj: GoogleAuth<JSONClient>;

  public static get authenticationObject() {
    return GoogleServicesManager.authObj;
  }
}
