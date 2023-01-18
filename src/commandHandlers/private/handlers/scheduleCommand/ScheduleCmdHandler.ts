import PrivateCmdHandler from "../../PrivateCmdHandler";
import {IPrivateContextDecorator} from "../../../../tglib/tgTypes/contextDecoratorTypes";
import {CMD_NAME_TYPE, CMD_NAMES} from "../../../../types/commandTypes";

export default class ScheduleCmdHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId);

        this._name = ScheduleCmdHandler._name
    }

    copy(): PrivateCmdHandler {
        return new ScheduleCmdHandler(this.id)
    }

    protected override onCommand(contextDecorator: IPrivateContextDecorator) {
        this.sendMessage('Ty pidor')
    }

    protected static override readonly _name: CMD_NAME_TYPE = CMD_NAMES.SCHEDULE
}