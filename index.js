const Bot = require('./app/Bot.js')

const KolesoBot = new Bot()
try {
    KolesoBot.initBot()
}catch (err) {
    console.log(err)
}
