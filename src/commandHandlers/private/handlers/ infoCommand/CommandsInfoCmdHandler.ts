import PrivateCmdHandler from "../../PrivateCmdHandler";
import {CMD_NAMES} from "../../../../types/commandTypes";

// const FirebaseDB = require('../../google/FireStoreDB');

export default class CommandsInfoHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId);

        this._name = CMD_NAMES.COMMANDS_INFO
    }

    copy() {
        return new CommandsInfoHandler(this.id)
    }
    onCommand() {
        // this.sendMessage(this.id, FirebaseDB.getReplyMessage('commands', 'commands_description'));
    }
}
