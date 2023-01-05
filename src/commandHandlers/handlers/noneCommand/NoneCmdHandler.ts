import CmdHandler from "../CmdHandler";
import {CMD_NAME_TYPE, CMD_NAMES} from "../../../types/commandTypes";
import {IContextDecorator} from "../../../tglib/tgTypes/contextDecoratorTypes";

class NoneCmdHandler extends CmdHandler {

    constructor(userId: number) {
        super(userId);

        this._name = NoneCmdHandler.handlerName
    }

    override copy(): CmdHandler {
        return new NoneCmdHandler(this.id);
    }

    override onCallbackQuery() {
        this.sendMessage('Аби зі мною поспілкуватися, треба використати одну з команд :).')
    }

    override onUpdate(contextDecorator: IContextDecorator) {
        this.sendMessage('Аби зі мною поспілкуватися, треба використати одну з команд :).')
    }

    protected static override readonly _name: CMD_NAME_TYPE = CMD_NAMES.NONE
}

export default NoneCmdHandler