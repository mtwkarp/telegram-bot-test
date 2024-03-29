import { type CMD_NAMES } from './enums';

export interface CommandDescription {
  readonly command: CMD_NAMES
  readonly description: string
}

export type CommandsDictionary = Record<string, CommandDescription>

export type CMD_NAME_TYPE =
    CMD_NAMES.SCHEDULE |
    CMD_NAMES.COMMANDS_INFO |
    CMD_NAMES.NONE |
    CMD_NAMES.START |
    CMD_NAMES.SAVE_PHOTO
