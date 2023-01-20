import {GoogleServiceInterface} from "../types";
import {google, sheets_v4} from "googleapis";
import {GoogleAuth} from "google-auth-library";
import {JSONClient} from "google-auth-library/build/src/auth/googleauth";
import Sheets = sheets_v4.Sheets;
export default class SheetsService implements GoogleServiceInterface{
  private spreadsheet: Sheets
  private values: sheets_v4.Resource$Spreadsheets$Values
  private spreadsheetId: string
  constructor() {
    // this.spreadsheet = null;
    // this.spreadsheetId = '';
    // this.values = null;
  }

  setSpreadSheetId(id: string) {
    this.spreadsheetId = id;
  }

  initService(authenticationObj: GoogleAuth<JSONClient>) {
    this.spreadsheet = google.sheets({
      version: 'v4',
      auth: authenticationObj
    });

    this.values = this.spreadsheet.spreadsheets.values;
  }

  // async getSheetValues({range}) {
  //   // const values = (await this.values.get({
  //   //   spreadsheetId: this.spreadsheetId,
  //   //   range
  //   // })).data.values;
  //   //
  //   // return values;
  // }

  updateSheetValues(options = {range: '', valueInputOption: 'USER_ENTERED', majorDimension: 'COLUMNS', values: []}) {
    // const inputOptions = options.valueInputOption || 'USER_ENTERED';
    // const mDimension = options.majorDimension || 'COLUMNS';
    //
    // const updatePromise = this.values.update({
    //   spreadsheetId: this.spreadsheetId,
    //   range: options.range,
    //   valueInputOption: inputOptions,
    //   resource: {
    //     range: options.range,
    //     majorDimension: mDimension,
    //     values: options.values
    //   }
    // });
    //
    // return updatePromise;
  }
}
