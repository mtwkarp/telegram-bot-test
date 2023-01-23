
export type ValueInputOption = 'INPUT_VALUE_OPTION_UNSPECIFIED' | 'RAW' | 'USER_ENTERED'
export type Dimension = 'ROWS' | 'COLUMNS'
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
