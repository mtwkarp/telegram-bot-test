
enum PRIVATE_UPDATE_TYPES {
    text = 'text',
    callback_query = 'callback_query',

    command='command',
    animation = 'animation',
    audio='audio',
    document='document',
    photo='photo',
    sticker='sticker',
    video='video',
    video_note='video_note',
    voice='voice',
    edited_message='edited_message',
    // inline_query='inline_query' ???
    // chosen_inline_result='chosen_inline_result' ???
    // shipping_query='shipping_query'
    // pre_checkout_query='pre_checkout_query'
    // poll = 'poll'
    //poll_answer ='poll_answer'
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