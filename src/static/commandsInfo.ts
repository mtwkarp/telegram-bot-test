import {CommandsDictionary} from "../types/types";

const commandsDescription: Readonly<CommandsDictionary> = {
    schedule: {command: 'schedule', description: 'Надіслати розклад.'},
    info: {command: 'commandsinfo', description: 'Інформація по доступних командах бота.'}
}

export {commandsDescription}