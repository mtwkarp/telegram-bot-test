import { type UserScheduleObj } from './ts/schedule_cmd_types';
import { CallbackQuery, type InlineKeyboardMarkup } from 'typegram';
import ScheduleMarkupViewCreator from './ScheduleMarkupViewCreator';
import { DayNames } from '../../../../types/enums';
import { notAvailableInstructor } from './static/scheduleSheetsConstants';
import { type Markup } from 'telegraf';
import { type IPrivateCbQueryPayload } from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import DataQuery = CallbackQuery.DataQuery

export default class ScheduleMarkupEditor {
  private _userSchedule: UserScheduleObj;
  private previouslySentMarkup: InlineKeyboardMarkup;
  private readonly markupViewCreator: ScheduleMarkupViewCreator;
  constructor() {
    this.markupViewCreator = new ScheduleMarkupViewCreator();
    this.setDefaultUserSchedule();
  }

  public get userSchedule(): UserScheduleObj {
    return Object.assign({}, this._userSchedule);
  }

  public getDefaultMarkup(): Markup.Markup<InlineKeyboardMarkup> {
    this.setDefaultUserSchedule();

    return this.markupViewCreator.getDefaultMarkup(this._userSchedule);
  }

  public getPendingMarkup(): Markup.Markup<InlineKeyboardMarkup> {
    return this.markupViewCreator.getPendingMarkup(this._userSchedule);
  }

  public getModifiedMarkup(): Markup.Markup<InlineKeyboardMarkup> {
    return this.markupViewCreator.getDefaultMarkup(this._userSchedule);
  }

  public checkUpdatedMarkupEquality(): boolean {
    const updatedUserMarkup = this.markupViewCreator.getDefaultMarkup(this._userSchedule).reply_markup;

    const markupEqualityCheck = JSON.stringify(updatedUserMarkup) === JSON.stringify(this.previouslySentMarkup);

    this.previouslySentMarkup = this.markupViewCreator.getDefaultMarkup(this._userSchedule).reply_markup;

    return markupEqualityCheck;
  }

  public handleDayChoiceClick(payload: IPrivateCbQueryPayload) {
    const cbQuery = payload.callback_query as DataQuery;
    const data = cbQuery.data;

    // @ts-expect-error if data is not type of notAvailableInstructor | DayNames
    this._userSchedule[data] = !this._userSchedule[data];

    if (data === notAvailableInstructor) {
      this.clearAllDaysIfInstructorUnavailable();
    } else {
      this.makeInstructorAvailable();
    }
  }

  private clearAllDaysIfInstructorUnavailable(): void {
    if (this._userSchedule[notAvailableInstructor]) {
      for (const userScheduleKey in this._userSchedule) {
        if (userScheduleKey === notAvailableInstructor) continue;
        // @ts-expect-error refactor
        this._userSchedule[userScheduleKey] = false;
      }
    }
  }

  private makeInstructorAvailable() {
    this._userSchedule[notAvailableInstructor] = false;
  }

  public getConfirmedMarkup(): Markup.Markup<InlineKeyboardMarkup> {
    return this.markupViewCreator.getDefaultMarkup(this._userSchedule, true);
  }

  public checkIfScheduleFilled(): boolean {
    for (const dayKey in this._userSchedule) {
      // @ts-expect-error refactor
      if (this._userSchedule[dayKey] === true) return true;
    }

    return false;
  }

  private setDefaultUserSchedule(): void {
    this._userSchedule = {
      [DayNames.monday]: false,
      [DayNames.tuesday]: false,
      [DayNames.wednesday]: false,
      [DayNames.thursday]: false,
      [DayNames.friday]: false,
      [DayNames.saturday]: false,
      [DayNames.sunday]: false,
      [notAvailableInstructor]: false
    };
  }
}
