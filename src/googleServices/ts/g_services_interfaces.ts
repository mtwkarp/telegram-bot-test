import {ValueInputOption} from "./g_services_types";
import {Dimension} from "./g_services_types";

export interface SheetUpdateParams  {
    range: string,
    valueInputOption?: ValueInputOption,
    values: any[][] | any[]
    majorDimension?: Dimension
}
export interface GoogleServiceInterface {
    // initService(): void
}

export interface IGoogleSheet extends GoogleServiceInterface {
    getSheetValues(options: SheetValuesGetOptions): Promise<any[][]>,
    // updateSheetValues():
}

export interface SheetValuesGetOptions {
    range: string
}
