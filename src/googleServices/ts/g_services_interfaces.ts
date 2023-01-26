import { type ValueInputOption, type Dimension } from './g_services_types';

export interface SheetUpdateParams {
  range: string
  valueInputOption?: ValueInputOption
  values: any[][] | any[]
  majorDimension?: Dimension
}
export interface IGoogleSheet {
  getSheetValues: (options: SheetValuesGetOptions) => Promise<any[][]>
  // updateSheetValues():
}

export interface SheetValuesGetOptions {
  range: string
}
