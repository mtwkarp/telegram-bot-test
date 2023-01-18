import PrivateCmdHandler from "../../PrivateCmdHandler";
import {CMD_NAME_TYPE, CMD_NAMES} from "../../../../types/commandTypes";
import {DefaultCmdHandler} from "../../../../types/types";

class NoneCmdHandler extends PrivateCmdHandler implements DefaultCmdHandler{

    constructor(userId: number) {
        super(userId);

        this._name = NoneCmdHandler.handlerName


    }

    override copy(): PrivateCmdHandler {
        return new NoneCmdHandler(this.id);
    }

    public sendNotAvailableCmdMessage(): void {
        this.sendMessage('Дана команда наразі вам недоступна. Зверніться до адміністратора бота.')
    }

    protected static override readonly _name: CMD_NAME_TYPE = CMD_NAMES.NONE
}

export default NoneCmdHandler