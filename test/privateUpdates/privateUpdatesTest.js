const { default: test } = require('ava')
const { default: MyBot} = require('../dist/MyBot.js')
const {default: UpdateTemplatesCreator} = require("../dist/tglib/helpers/UpdateTemplatesCreator");
const {PRIVATE_UPDATE_TYPES} = require("../dist/tglib/tgTypes/botUpdatesTypes");
const {default: TelegrafBot} = require('../../dist/TelegrafBot')
const {default: TestCmdHandler} = require('../../dist/commandHandlers/private/handlers/testCommand/TestCmdHandler')
const {default: EnvLoader} = require('../../dist/envLoader/EnvLoader')
const {default: PrivateUpdateSubject} = require('../../dist/tglib/botUpdatesObservers/PrivateUpdateSubject')


const privateUpdateTypes = [
    PRIVATE_UPDATE_TYPES.text
]

// for(const key in PRIVATE_UPDATE_TYPES) {
//     privateUpdateTypes.push(PRIVATE_UPDATE_TYPES[key])
// }


const envLoader = new EnvLoader()
envLoader.load()

privateUpdateTypes.forEach((privateUpdateType) => {
    // const TelegrafBot = new TelegrafBot()
    const PrivateUpdateSubject = new PrivateUpdateSubject()
    const TestCmdHandler = new TestCmdHandler()

    PrivateUpdateSubject.registerObserver(TestCmdHandler)


    // PrivateUpdateSubject.subscribeForBotUpdates(TelegrafBot)

})

async function privateUpdatesTest() {
    const myBot = new MyBot(privateUpdateTypes, [])

    await myBot.init()

    for (let i = 0; i < privateUpdateTypes.length; i++) {
        const updateType = privateUpdateTypes[i]
        const updateTemplate = UpdateTemplatesCreator.getTemplate(updateType)
        await myBot.bot.handleUpdate(updateTemplate.update)
    }

}

test('all private update should by implemented or do not break system', async (t) =>
    await privateUpdatesTest()
)