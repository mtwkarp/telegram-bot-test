import {IContextDecoratorCreator} from "../tgTypes/contextDecoratorCreator";
import {SCOPE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from "typegram";
import {IContextDecorator} from "../tgTypes/contextDecoratorTypes";
import {IPayloadCreator} from "../tgTypes/messagePayload/payloadCreator";
import {BOT_UPDATE_SCOPE} from "../tgTypes/botUpdatesScopes";

export default abstract class ContextDecoratorCreator<U extends SCOPE_UPDATE_TYPES> implements IContextDecoratorCreator<U> {

    protected abstract updateScope: BOT_UPDATE_SCOPE
    protected abstract payloadCreator: IPayloadCreator

    public abstract createDecorator(updateType: U, context: Context<Update>): IContextDecorator
}