import PrivateCmdHandler from "../PrivateCmdHandler";
import {CMD_NAME_TYPE, CMD_NAMES} from "../../../types/commandTypes";
import {IContextDecorator, IPrivateContextDecorator} from "../../../tglib/tgTypes/contextDecoratorTypes";

class NoneCmdHandler extends PrivateCmdHandler {

    constructor(userId: number) {
        super(userId);

        this._name = NoneCmdHandler.handlerName
    }

    override copy(): PrivateCmdHandler {
        return new NoneCmdHandler(this.id);
    }

    override onCallbackQuery() {
        this.sendMessage('Аби зі мною поспілкуватися, треба використати одну з команд :).')
    }

    override onUpdate(contextDecorator: IPrivateContextDecorator) {
        this.updateTypesImplementations[contextDecorator.updateType](contextDecorator)
        this.sendMessage('Аби зі мною поспілкуватися, треба використати одну з команд :).')
    }

    protected static override readonly _name: CMD_NAME_TYPE = CMD_NAMES.NONE
}

export default NoneCmdHandler