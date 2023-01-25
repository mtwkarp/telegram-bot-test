import PrivateCmdHandler from "../../PrivateCmdHandler";
import {IPrivateContextDecorator} from "../../../../tglib/tgTypes/contextDecoratorTypes";
import {CMD_NAMES} from "../../../../types/enums";
import {ITimeAccessController} from "../../../../types/interfaces";
import ScheduleCmdTimeAccessController from "./ScheduleCmdTimeAccessController";
import {IPrivateCbQueryPayload} from "../../../../tglib/tgTypes/messagePayload/contextPayloadTypes";
import {CallbackQuery} from "typegram";
import {confirmScheduleBtnText} from "./static/scheduleSheetsConstants";
import InstructorsAvailabilitySheet
    from "../../../../googleServices/gsheets/scheduleSheet/scheduleSheets/InstructorsAvailabilitySheet";
import ScheduleMarkupEditor from "./ScheduleMarkupEditor";
import ScheduleCmdResponder from "./ScheduleCmdResponder";
import {SCHEDULE_MARKUP_STATUS} from "./ts/schedule_cmd_enums";
import DataQuery = CallbackQuery.DataQuery;

export default class ScheduleCmdHandler extends PrivateCmdHandler {

    private readonly timeAccessController: ITimeAccessController
    private readonly scheduleSheet: InstructorsAvailabilitySheet
    private readonly msgResponder: ScheduleCmdResponder
    private markupEditor: ScheduleMarkupEditor
    private readonly markupStatus: {[key: number]: SCHEDULE_MARKUP_STATUS}
    constructor(userId: number) {
        super(userId, CMD_NAMES.SCHEDULE);

        this.markupStatus = {}

        this.markupEditor = new ScheduleMarkupEditor()

        this.scheduleSheet = new InstructorsAvailabilitySheet()

        this.msgResponder = new ScheduleCmdResponder(userId)

        this.timeAccessController = new ScheduleCmdTimeAccessController()
        this.timeAccessController.init()
    }

    copy(): PrivateCmdHandler {
        return new ScheduleCmdHandler(this.id)
    }
    protected override onCommand(contextDecorator: IPrivateContextDecorator): void {
        this.requestScheduleMarkup(contextDecorator)
    }

    protected override onCallbackQuery(contextDecorator: IPrivateContextDecorator) {
        this.onButtonClick(contextDecorator);
    }

    protected requestScheduleMarkup(contextDecorator: IPrivateContextDecorator): void {
        if (!this.timeAccessController.accessible) {
            this.msgResponder.notifyUserAboutClosedSchedule()

            return;
        }

        const payload = contextDecorator.payload as IPrivateCbQueryPayload
        this.markupStatus[payload.messageId] = SCHEDULE_MARKUP_STATUS.active

        this.msgResponder.sendDefaultMarkupWithDescription(this.markupEditor.getDefaultMarkup())
    }

    protected async onButtonClick(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivateCbQueryPayload
        const cbQuery = payload.callback_query as DataQuery
        const data = cbQuery.data as string

        if(this.markupStatus[payload.messageId] === SCHEDULE_MARKUP_STATUS.sending) {
            return
        }

        if(this.markupStatus[payload.messageId] === SCHEDULE_MARKUP_STATUS.unactive) {
            this.msgResponder.notifyUserAboutUnactiveMarkup()
            return
        }

        if (data === confirmScheduleBtnText) {
            await this.confirmSchedule(payload.messageId);

            return;
        }

        this.markupEditor.handleDayChoiceClick(payload)

        if (!this.markupEditor.checkUpdatedMarkupEquality()) {
            await this.msgResponder.editMarkup(payload.messageId, undefined, this.markupEditor.getModifiedMarkup())
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

        this.markupStatus[messageId] = SCHEDULE_MARKUP_STATUS.sending

        await this.msgResponder.editMarkup(messageId, undefined, this.markupEditor.getPendingMarkup())
        await this.scheduleSheet.updateUserSchedule(this.id, this.markupEditor.userSchedule)
            .then(() => {
                this.msgResponder.sendConfirmedScheduleReply()
                this.msgResponder.editMarkup(messageId, undefined, this.markupEditor.getConfirmedMarkup())
                this.markupStatus[messageId] = SCHEDULE_MARKUP_STATUS.unactive
            })
            .catch(() => {
                this.msgResponder.respondWithUnsuccessfulSpreadsheetInput()
                this.markupStatus[messageId] = SCHEDULE_MARKUP_STATUS.unactive
            });
    }
}