import { type IGoogleSheet, type SheetUpdateParams, type SheetValuesGetOptions } from '../ts/g_services_interfaces';
import { google, sheets_v4 } from 'googleapis';
import Sheets = sheets_v4.Sheets
import GoogleServicesManager from '../GoogleServicesManager';

export default class SheetsService implements IGoogleSheet {
  private readonly spreadsheet: Sheets;
  private readonly values: sheets_v4.Resource$Spreadsheets$Values;
  private readonly spreadsheetId: string;
  constructor(spreadsheetId: string) {
    this.spreadsheetId = spreadsheetId;

    this.spreadsheet = google.sheets({
      version: 'v4',
      auth: GoogleServicesManager.authenticationObject
    });

    this.values = this.spreadsheet.spreadsheets.values;
  }

  public async getSheetValues({ range }: SheetValuesGetOptions): Promise<any[][]> {
    const values = (await this.values.get({
      spreadsheetId: this.spreadsheetId,
      range
    })).data.values;

    if (values === null || values === undefined) {
      console.log('No value found in sheets');
      return [[]];
    }

    return values;
  }

  public async updateSheetValues(params: SheetUpdateParams): Promise<any> {
    const inputOptions = params.valueInputOption || 'USER_ENTERED';
    const mDimension = params.majorDimension || 'COLUMNS';

    return await this.values.update(
      {
        spreadsheetId: this.spreadsheetId,
        range: params.range,
        valueInputOption: inputOptions,
        requestBody: {
          range: params.range,
          majorDimension: mDimension,
          values: params.values
        }
      }
    );
  }
}
