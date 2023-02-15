enum UPDATE_SCOPES {
  CHANNEL = 'channel_scope',
  CHAT = 'chat_scope',
  PRIVATE = 'private_scope'
}

type CHANNEL_UPDATE_SCOPE = UPDATE_SCOPES.CHANNEL
type CHAT_UPDATE_SCOPE = UPDATE_SCOPES.CHAT
type PRIVATE_UPDATE_SCOPE = UPDATE_SCOPES.PRIVATE

type BOT_UPDATE_SCOPE = CHANNEL_UPDATE_SCOPE | CHAT_UPDATE_SCOPE | PRIVATE_UPDATE_SCOPE

export { type BOT_UPDATE_SCOPE, type CHANNEL_UPDATE_SCOPE, type CHAT_UPDATE_SCOPE, type PRIVATE_UPDATE_SCOPE, UPDATE_SCOPES };
