const TelegramApi = require('node-telegram-bot-api')
const token = '5578721046:AAFL3QeNl7tpunNcic5_nRDGodArhNgnpD4'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: 1}, {text: '2', callback_data: 2}, {text: '3', callback_data: 3}],
            [{text: '4', callback_data: 4},{text: '5', callback_data: 5}, {text: '6', callback_data: 6}],
            [{text: '7', callback_data: 7}, {text: '8', callback_data: 8}, {text: '9', callback_data: 9}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Play again', callback_data: '/again'}]
        ]
    })
}

const start = function () {
    bot.setMyCommands([
        {command: '/start', description: 'Start cmd'},
        {command: '/info', description: 'Info cmd'},
        {command: '/game', description: 'game cmd'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            return bot.sendMessage(chatId, `Lets do some work here`)

        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Now I will get you some info`)
        }

        if (text === '/game') {
           return playGame(chatId)
        }

        return bot.sendMessage(chatId, "I dont understand")
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(data, chatId, chats[chatId])

        if(msg.data === '/again') {
            return playGame(chatId)
        }

        if(data === chats[chatId]) {
            await bot.sendMessage(chatId, `Вгадав !`, againOptions)

        }else {
            await bot.sendMessage(chatId, `Не вгадав !`, againOptions)
        }

        console.log(msg.data)
    })
}

const playGame = async function (chatId) {
    await bot.sendMessage(chatId, 'Зараз я загадаю цифру від 1 до 9')
    const randomNumber = Math.floor(Math.random() * 10)

    chats[chatId] = randomNumber + ''
    console.log(randomNumber)
    return bot.sendMessage(chatId, 'Відгадуй !', gameOptions)
}


start()
