import {DECORATOR_CREATOR_HOLDERS_TYPES, IPayloadCreator} from "../tgTypes/messagePayload/payloadCreator";
import {SCOPE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context} from "telegraf";
import {Update} from "typegram";
import {CONTEXT_PAYLOAD_TYPE} from "../tgTypes/messagePayload/contextPayloadTypes";

export default abstract class PayloadCreator<U extends SCOPE_UPDATE_TYPES, P extends CONTEXT_PAYLOAD_TYPE> implements IPayloadCreator {

    protected abstract decoratorCreatorFunctionByUpdateType: DECORATOR_CREATOR_HOLDERS_TYPES

    public create(updateType: U, context: Context<Update>): P {

        // @ts-ignore
        return this.decoratorCreatorFunctionByUpdateType[updateType](context)
    }


}