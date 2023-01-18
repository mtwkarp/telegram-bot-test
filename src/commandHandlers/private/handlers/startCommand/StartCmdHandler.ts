import PrivateCmdHandler from "../../PrivateCmdHandler";
import {CMD_NAMES} from "../../../../types/commandTypes";

// const BotCmdHandler = require('../BotCmdHandler');
// const FirebaseDB = require('../../google/FireStoreDB');

export default class StartCmdHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId);

        this._name = CMD_NAMES.START
    }

    copy(): PrivateCmdHandler {
        return new StartCmdHandler(this.id)
    }

    protected override onCommand() {
        // this.sendMessage(this.id, FirebaseDB.getReplyMessage('start', 'bot_introduction'));
    }
}

