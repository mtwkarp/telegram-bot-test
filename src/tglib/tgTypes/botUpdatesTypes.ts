
enum PRIVATE_UPDATE_TYPES {
    text = 'text',
    callback_query = 'callback_query',
    command='command'
}


enum CHANNEL_UPDATE_TYPES {
    channel_post = 'channel_post'
}

enum CHAT_UPDATE_TYPES {
    new_chat_photo = 'new_chat_photo',
    command='command'
}



type SCOPE_UPDATE_TYPES = PRIVATE_UPDATE_TYPES | CHANNEL_UPDATE_TYPES | CHAT_UPDATE_TYPES

export {PRIVATE_UPDATE_TYPES, CHANNEL_UPDATE_TYPES, CHAT_UPDATE_TYPES, SCOPE_UPDATE_TYPES}