import Subject from "../lib/observer/Subject";
import type {PRIVATE_UPDATE_TYPE} from "../types/botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from "typegram"

class PrivateUpdateSubject extends Subject<any> {

    constructor() {
        super();

        this.observers = []
    }

    subscribeForBotMessages() {

    }
    protected  onUpdate(messageType: PRIVATE_UPDATE_TYPE, context: Context<Update>): void {
    }
}

export default PrivateUpdateSubject