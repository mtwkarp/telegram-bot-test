import {DECORATOR_CREATOR_HOLDERS_TYPES, IPayloadCreator} from "../tgTypes/messagePayload/payloadCreator";
import {SCOPE_UPDATE_TYPES} from "../tgTypes/botUpdatesTypes";
import {Context} from "telegraf";
import {Message, Update} from "typegram";
import {
    CONTEXT_PAYLOAD_TYPE, MediaPayload
} from "../tgTypes/messagePayload/contextPayloadTypes";
import MediaMessage = Message.MediaMessage;

export default abstract class PayloadCreator<U extends SCOPE_UPDATE_TYPES, P extends CONTEXT_PAYLOAD_TYPE> implements IPayloadCreator {

    protected abstract decoratorCreatorFunctionByUpdateType: DECORATOR_CREATOR_HOLDERS_TYPES

    public create(updateType: U, context: Context<Update>): P {
        // @ts-ignore
        return this.decoratorCreatorFunctionByUpdateType[updateType](context)
    }

    protected getDefaultMediaValuesFromMsg(message: MediaMessage): MediaPayload {
        return {
            caption: message.caption,
            caption_entities: message.caption_entities,
            media_group_id: message.media_group_id
        }
    }
}