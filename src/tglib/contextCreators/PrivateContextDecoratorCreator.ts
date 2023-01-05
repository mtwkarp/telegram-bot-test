import ContextDecoratorCreator from "./ContextDecoratorCreator";
import {UPDATE_SCOPES} from "../tgTypes/botUpdatesScopes";
import PrivatePayloadCreator from "../payloadCreators/PrivatePayloadCreator";
import {PRIVATE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {IPrivateContextDecorator} from "../tgTypes/contextDecoratorTypes";
import {Context} from "telegraf";
import {Update} from "typegram";
export default class PrivateContextDecoratorCreator extends ContextDecoratorCreator<PRIVATE_UPDATE_TYPES> {
    protected readonly updateScope: UPDATE_SCOPES.PRIVATE = UPDATE_SCOPES.PRIVATE
    protected readonly payloadCreator: PrivatePayloadCreator = new PrivatePayloadCreator()

    createDecorator(updateType: PRIVATE_UPDATE_TYPES, context: Context<Update>): IPrivateContextDecorator {
        const payload = this.payloadCreator.create(updateType, context)

        return {
            payload,
            messagePayloadType: payload.type,
            updateType,
            updateScope: this.updateScope,
            context
        }
    }


}