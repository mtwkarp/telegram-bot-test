
export interface IContextPayload {
    senderId: string
}

export interface IPrivateContextPayload extends IContextPayload {
    chatId: number
}

export interface IChannelContextPayload extends IContextPayload {
    // chatId: number
}

export interface IChatContextPayload extends IContextPayload {
    // chatId: number
}


export type CONTEXT_PAYLOAD_TYPES = IPrivateContextPayload | IChannelContextPayload | IChatContextPayload