
enum MESSAGES_TYPES {
  text = 'text',
  audio = 'audio',
  document = 'document',
  animation = 'animation',
  photo = 'photo',
  sticker = 'sticker',
  video = 'video',
  video_note = 'video_note',
  voice = 'voice',
  contact = 'contact',
  dice = 'dice',
  game = 'game',
  poll = 'poll',
  location = 'location',
  venue = 'venue',
  new_chat_members = 'new_chat_members',
  left_chat_member = 'left_chat_member',
  new_chat_title = 'new_chat_title',
  new_chat_photo = 'new_chat_photo',
  delete_chat_photo = 'delete_chat_photo',
  group_chat_created = 'group_chat_created',
  supergroup_chat_created = 'supergroup_chat_created',
  channel_chat_created = 'channel_chat_created',
  message_auto_delete_timer_changed = 'message_auto_delete_timer_changed',
  migrate_to_chat_id = 'migrate_to_chat_id',
  migrate_from_chat_id = 'migrate_from_chat_id',
  pinned_message = 'pinned_message',
  invoice = 'invoice',
  successful_payment = 'successful_payment',
  connected_website = 'connected_website',
  passport_data = 'passport_data',
  proximity_alert_triggered = 'proximity_alert_triggered',
  forum_topic_created = 'forum_topic_created',
  forum_topic_closed = 'forum_topic_closed',
  forum_topic_reopened = 'forum_topic_reopened',
  video_chat_scheduled = 'video_chat_scheduled',
  video_chat_started = 'video_chat_started',
  video_chat_ended = 'video_chat_ended',
  video_chat_participants_invited = 'video_chat_participants_invited',
  web_app_data = 'web_app_data',
  none = 'none'
}

enum UPDATE_TYPES {
  message = 'message',
  edited_message = 'edited_message',
  channel_post = 'channel_post',
  edited_channel_post = 'edited_channel_post',
  inline_query = 'inline_query',
  chosen_inline_result = 'chosen_inline_result',
  callback_query = 'callback_query',
  shipping_query = 'shipping_query',
  pre_checkout_query = 'pre_checkout_query',
  poll = 'poll',
  poll_answer = 'poll_answer',
  my_chat_member = 'my_chat_member',
  chat_member = 'chat_member',
  chat_join_request = 'chat_join_request',
  unknown = 'unknown'
}

// const d = UPDATE_TYPES['message']

// FROM MESSAGES_TYPES OR UPDATE_TYPES
enum PRIVATE_UPDATE_TYPES {
  text = 'text',
  callback_query = 'callback_query',

  command = 'command',
  animation = 'animation',
  audio = 'audio',
  document = 'document',
  photo = 'photo',
  sticker = 'sticker',
  video = 'video',
  video_note = 'video_note',
  voice = 'voice',
  edited_message = 'edited_message',
  location = 'location'
  // inline_query='inline_query' ???
  // chosen_inline_result='chosen_inline_result' ???
  // shipping_query='shipping_query'
  // pre_checkout_query='pre_checkout_query'
  // poll = 'poll'
  // poll_answer ='poll_answer'
}

// FROM MESSAGES_TYPES OR UPDATE_TYPES

enum CHANNEL_UPDATE_TYPES {
  channel_post = 'channel_post'
}
// FROM MESSAGES_TYPES OR UPDATE_TYPES

enum CHAT_UPDATE_TYPES {
  new_chat_photo = 'new_chat_photo',
  command = 'command'
}

type SCOPE_UPDATE_TYPES = PRIVATE_UPDATE_TYPES | CHANNEL_UPDATE_TYPES | CHAT_UPDATE_TYPES

export { PRIVATE_UPDATE_TYPES, CHANNEL_UPDATE_TYPES, CHAT_UPDATE_TYPES, type SCOPE_UPDATE_TYPES, MESSAGES_TYPES, UPDATE_TYPES };
