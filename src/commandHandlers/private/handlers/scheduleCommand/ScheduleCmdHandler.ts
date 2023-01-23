import PrivateCmdHandler from "../../PrivateCmdHandler";
import {IPrivateContextDecorator} from "../../../../tglib/tgTypes/contextDecoratorTypes";
import {CMD_NAMES} from "../../../../types/commandTypes";

export default class ScheduleCmdHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId);

        this._name = CMD_NAMES.SCHEDULE
    }

    copy(): PrivateCmdHandler {
        return new ScheduleCmdHandler(this.id)
    }

    protected override onCommand(contextDecorator: IPrivateContextDecorator) {
        // this.sendMessage('Ty pidor')
    }
}