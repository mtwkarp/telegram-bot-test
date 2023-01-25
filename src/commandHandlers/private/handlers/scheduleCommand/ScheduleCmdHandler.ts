import PrivateCmdHandler from "../../PrivateCmdHandler";
import {IPrivateContextDecorator} from "../../../../tglib/tgTypes/contextDecoratorTypes";
import {CMD_NAMES} from "../../../../types/enums";
import {DayNames} from "../../../../types/enums";
import {ITimeAccessController} from "../../../../types/interfaces";
import ScheduleCmdTimeAccessController from "./ScheduleCmdTimeAccessController";
import {IPrivateCbQueryPayload} from "../../../../tglib/tgTypes/messagePayload/contextPayloadTypes";
import {CallbackQuery, InlineKeyboardMarkup, Message} from "typegram";
import DataQuery = CallbackQuery.DataQuery;
import {confirmScheduleBtnText, notAvailableInstructor} from "./static/scheduleSheetsConstants";
import {UserScheduleObj} from "./static/scheduleCmdTypes";
import ScheduleMarkupViewCreator from "./ScheduleMarkupViewCreator";
import ReplyMsgCollection from "../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";

import InstructorsAvailabilitySheet
    from "../../../../googleServices/gsheets/scheduleSheet/scheduleSheets/InstructorsAvailabilitySheet";

export default class ScheduleCmdHandler extends PrivateCmdHandler {

    private readonly timeAccessController: ITimeAccessController
    private readonly markupViewCreator: ScheduleMarkupViewCreator
    private readonly scheduleSheet: InstructorsAvailabilitySheet
    private scheduleConfirmed: boolean
    private userSchedule: UserScheduleObj
    private previouslySentMarkup: InlineKeyboardMarkup
    private repliesCollection: ReplyMsgCollection
    constructor(userId: number) {
        super(userId, CMD_NAMES.SCHEDULE);

        this.scheduleSheet = new InstructorsAvailabilitySheet()

        this.repliesCollection = ReplyMsgCollection.getInstance()

        this.scheduleConfirmed = false

        this.timeAccessController = new ScheduleCmdTimeAccessController()
        this.timeAccessController.init()

        this.markupViewCreator = new ScheduleMarkupViewCreator()
        this.normalizeUserSchedule()
    }

    copy(): PrivateCmdHandler {
        return new ScheduleCmdHandler(this.id)
    }

    protected override onCommand(contextDecorator: IPrivateContextDecorator) {
        this.scheduleConfirmed = false
        this.normalizeUserSchedule()
        this.requestScheduleMarkup()
    }

    protected override onCallbackQuery(contextDecorator: IPrivateContextDecorator) {
        this.onButtonClick(contextDecorator);
    }

    async requestScheduleMarkup() {
        if (!this.timeAccessController.accessible) {
            this.notifyUserAboutClosedSchedule();

            return;
        }

        this.sendScheduleMarkup();
    }

    async sendScheduleMarkup(): Promise<void> {
        const userMarkup = this.markupViewCreator.getMarkup(this.userSchedule);

        await this.tg.sendMessage(
            this.id,
            this.repliesCollection.getScheduleCmdReply('schedule_markup_description'),
            userMarkup
        );
    }

    async onButtonClick(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivateCbQueryPayload
        const cbQuery = payload.callback_query as DataQuery
        const data = cbQuery.data as string
        // refactor ???
        // if (this.scheduleConfirmed) {
        //     this.sendMessageIfScheduleConfirmed(ctx);
        //
        //     return;
        // }

        if (data === confirmScheduleBtnText) {
            await this.confirmSchedule(payload.messageId);

            return;
        }
        //refactor
        // @ts-ignore
        this.userSchedule[data] = !this.userSchedule[data];

        if (data === notAvailableInstructor) {
            this.clearAllDaysIfInstructorUnavailable();
        } else {
            this.makeInstructorAvailable();
        }

        const updatedUserMarkup = this.markupViewCreator.getMarkup(this.userSchedule).reply_markup;

        const markupEqualityCheck = JSON.stringify(updatedUserMarkup) === JSON.stringify(this.previouslySentMarkup);
        this.previouslySentMarkup = this.markupViewCreator.getMarkup(this.userSchedule).reply_markup;

        if (!markupEqualityCheck) {
            await this.tg.editMessageReplyMarkup(
                this.id,
                payload.messageId,
                undefined,
                updatedUserMarkup
            );
        }

        await contextDecorator.context.answerCbQuery();
    }

    async confirmSchedule(messageId: number) {
        if (!this.timeAccessController.accessible) {
            this.notifyUserAboutClosedSchedule();

            return;
        }

        if (!this.checkIfScheduleFilled()) {
            this.notifyUserToFillSchedule();

            return;
        }

        this.scheduleConfirmed = true;

        this.updateScheduleMarkupAfterConfirm(messageId);
        this.sendConfirmedScheduleToSpreadsheet();
    }

    async updateScheduleMarkupAfterConfirm(messageId: number): Promise<void> {
        this.sendMessage(this.repliesCollection.getScheduleCmdReply( 'confirmed_schedule_reply'));

        const updatedUserMarkup = this.markupViewCreator.getMarkup(this.userSchedule, true).reply_markup;

        await this.tg.editMessageReplyMarkup(
            this.id,
            messageId,
            undefined,
            updatedUserMarkup
        );
    }

    sendConfirmedScheduleToSpreadsheet(): void {
        this.scheduleSheet.updateUserSchedule(this.id, this.userSchedule);
    }

    notifyUserAboutClosedSchedule(): void {
        this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_closed'));
    }

    notifyUserToFillSchedule(): void {
        this.sendMessage(this.repliesCollection.getScheduleCmdReply('schedule_must_be_filled_before_sending'));
    }

    checkIfScheduleFilled(): boolean {
        for (const dayKey in this.userSchedule) {
            //refactor
            // @ts-ignore
            if (this.userSchedule[dayKey] === true) return true;
        }

        return false;
    }


    private normalizeUserSchedule(): void {
        this.userSchedule = {
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

    clearAllDaysIfInstructorUnavailable(): void {
        if (this.userSchedule[notAvailableInstructor]) {
            for (const userScheduleKey in this.userSchedule) {
                if (userScheduleKey === notAvailableInstructor) continue;
                //refactor
                // @ts-ignore
                this.userSchedule[userScheduleKey] = false;
            }
        }
    }

    makeInstructorAvailable() {
        this.userSchedule[notAvailableInstructor] = false;
    }
}