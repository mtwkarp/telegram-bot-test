import Subject from "../lib/observer/Subject";
import type {SCOPE_UPDATE_TYPE} from "../types/botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from "typegram"

abstract class PrivateUpdateSubject<botUpdateType> extends Subject<any> {

    protected onUpdate(messageType: botUpdateType, context: Context<Update>): void {
    }
}

export default PrivateUpdateSubject