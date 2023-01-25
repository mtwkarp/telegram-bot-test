import PrivateCmdHandler from "../../PrivateCmdHandler";
import {IPrivateContextDecorator} from "../../../../tglib/tgTypes/contextDecoratorTypes";
import {CMD_NAMES} from "../../../../types/enums";
import {ITimeAccessController} from "../../../../types/interfaces";
import ScheduleCmdTimeAccessController from "./ScheduleCmdTimeAccessController";
import {IPrivateCbQueryPayload} from "../../../../tglib/tgTypes/messagePayload/contextPayloadTypes";
import {CallbackQuery} from "typegram";
import DataQuery = CallbackQuery.DataQuery;
import {confirmScheduleBtnText} from "./static/scheduleSheetsConstants";
import ReplyMsgCollection from "../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";

import InstructorsAvailabilitySheet
    from "../../../../googleServices/gsheets/scheduleSheet/scheduleSheets/InstructorsAvailabilitySheet";
import ScheduleMarkupEditor from "./ScheduleMarkupEditor";
import ScheduleCmdResponder from "./ScheduleCmdResponder";

export default class ScheduleCmdHandler extends PrivateCmdHandler {

    private readonly timeAccessController: ITimeAccessController
    private readonly scheduleSheet: InstructorsAvailabilitySheet
    private readonly msgResponder: ScheduleCmdResponder
    private scheduleConfirmed: boolean
    private markupEditor: ScheduleMarkupEditor
    constructor(userId: number) {
        super(userId, CMD_NAMES.SCHEDULE);

        this.markupEditor = new ScheduleMarkupEditor()

        this.scheduleSheet = new InstructorsAvailabilitySheet()

        this.msgResponder = new ScheduleCmdResponder(userId)

        this.scheduleConfirmed = false

        this.timeAccessController = new ScheduleCmdTimeAccessController()
        this.timeAccessController.init()
    }

    copy(): PrivateCmdHandler {
        return new ScheduleCmdHandler(this.id)
    }

    protected override onCommand(contextDecorator: IPrivateContextDecorator): void {
        this.scheduleConfirmed = false
        this.requestScheduleMarkup()
    }

    protected override onCallbackQuery(contextDecorator: IPrivateContextDecorator) {
        this.onButtonClick(contextDecorator);
    }

    protected requestScheduleMarkup(): void {
        if (!this.timeAccessController.accessible) {
            this.msgResponder.notifyUserAboutClosedSchedule()

            return;
        }

        this.sendScheduleMarkup();
    }

    protected sendScheduleMarkup(): void {
        this.tg.sendMessage(
            this.id,
            ReplyMsgCollection.getInstance().getScheduleCmdReply('schedule_markup_description'),
            this.markupEditor.getDefaultMarkup()
        );
    }

    protected async onButtonClick(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivateCbQueryPayload
        const cbQuery = payload.callback_query as DataQuery
        const data = cbQuery.data as string

        if (data === confirmScheduleBtnText) {
            await this.confirmSchedule(payload.messageId);

            return;
        }

        this.markupEditor.handleDayChoiceClick(payload)

        if (!this.markupEditor.checkUpdatedMarkupEquality()) {
            await this.tg.editMessageReplyMarkup(
                this.id,
                payload.messageId,
                undefined,
                this.markupEditor.getModifiedMarkup().reply_markup
            );
        }
    }

    protected async confirmSchedule(messageId: number) {
        if (!this.timeAccessController.accessible) {
            this.msgResponder.notifyUserAboutClosedSchedule()
            return;
        }

        if (!this.markupEditor.checkIfScheduleFilled()) {
            this.msgResponder.notifyUserToFillSchedule()
            return;
        }

        this.scheduleConfirmed = true;

        this.updateScheduleMarkupAfterConfirm(messageId);
        this.sendConfirmedScheduleToSpreadsheet();
    }

    async updateScheduleMarkupAfterConfirm(messageId: number): Promise<void> {
        this.msgResponder.sendConfirmedScheduleReply()

        await this.tg.editMessageReplyMarkup(
            this.id,
            messageId,
            undefined,
            this.markupEditor.getConfirmedMarkup().reply_markup
        );
    }

    protected sendConfirmedScheduleToSpreadsheet(): void {
        this.scheduleSheet.updateUserSchedule(this.id, this.markupEditor.userSchedule);
    }
}