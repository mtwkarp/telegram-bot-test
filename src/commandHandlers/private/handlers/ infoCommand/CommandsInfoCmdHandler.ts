import PrivateCmdHandler from "../../PrivateCmdHandler";
import {CMD_NAMES} from "../../../../types/commandTypes";
import ReplyMsgCollection from "../../../../db/firestore/collectionManagers/implementations/ReplyMsgCollection";

export default class CommandsInfoHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId, CMD_NAMES.COMMANDS_INFO);
    }

    copy() {
        return new CommandsInfoHandler(this.id)
    }
    onCommand() {
        const reply = ReplyMsgCollection.getInstance().getValueFromDocument('commands', 'commands_description')

        this.sendMessage(reply);        // this.sendMessage(this.id, FirebaseDB.getReplyMessage('commands', 'commands_description'));
    }
}
