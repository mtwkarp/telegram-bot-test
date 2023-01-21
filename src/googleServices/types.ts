import GoogleServicesNames from "./googleServicesNames";
//REFACTOR
export interface SheetUpdateParams  {
    range: string,
    valueInputOption?: string,
    values: any[][] | any[]
    majorDimension?: string
}
export interface GoogleServiceInterface {
    // initService(): void
}

export interface IGoogleSheet extends GoogleServiceInterface {
    getSheetValues(options: SheetValuesGetOptions): Promise<any[][]>,
    // updateSheetValues():
}

export type GOOGLE_SERVICES_CREATORS_HOLDER = {
    [key in GoogleServicesNames]: () => GoogleServiceInterface
};

export interface SheetValuesGetOptions {
    range: string
}
