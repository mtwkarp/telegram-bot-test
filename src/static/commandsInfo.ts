import { type CommandsDictionary } from '../types/types';
import { CMD_NAMES } from '../types/enums';
const commandsDescription: Readonly<CommandsDictionary> = {
  schedule: { command: CMD_NAMES.SCHEDULE, description: 'Надіслати розклад.' },
  info: { command: CMD_NAMES.COMMANDS_INFO, description: 'Інформація по доступних командах бота.' },
  start: { command: CMD_NAMES.START, description: 'Старт роботи з ботом.' }
};

export { commandsDescription };
