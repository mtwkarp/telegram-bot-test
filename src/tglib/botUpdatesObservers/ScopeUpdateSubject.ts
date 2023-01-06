import Subject from "../lib/observer/Subject";
import type {SCOPE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context, Telegraf} from "telegraf";
import {Update} from "typegram"
import {IContextDecorator} from "../tgTypes/contextDecoratorTypes";
import {IContextDecoratorCreator} from "../tgTypes/contextDecoratorCreator";

abstract class ScopeUpdateSubject<B extends SCOPE_UPDATE_TYPES, U extends IContextDecorator> extends Subject<U> {

    protected receiveMessagesTypes: B[]
        constructor(receiveMessagesTypes: B[]) {
        super();

        this.receiveMessagesTypes = receiveMessagesTypes
    }

    protected subscribeForBotUpdates(bot: Telegraf) {
        this.subscribeForMessages(bot)
    }

    protected subscribeForMessages(bot: Telegraf) {
        this.receiveMessagesTypes.forEach(messageType => {
            if(messageType !== 'command') bot.on(messageType, (context: Context<Update>) => this.onUpdate(messageType, context))
        })
    }


    protected abstract contextDecoratorCreator: IContextDecoratorCreator<SCOPE_UPDATE_TYPES>
    protected abstract onUpdate(updateType: B, context: Context<Update>): void
}



export default ScopeUpdateSubject