type CommandDescription= {
    readonly command: CMD_NAMES,
    readonly description: string
}

type CommandsDictionary = {
    [cmdName: string]: CommandDescription
}

type CMD_NAME_TYPE =
    CMD_NAMES.SCHEDULE |
    CMD_NAMES.COMMANDS_INFO |
    CMD_NAMES.NONE |
    CMD_NAMES.START
enum CMD_NAMES  {
    SCHEDULE= 'schedule',
    COMMANDS_INFO = 'commandsinfo',
    NONE = 'none',
    START = 'start'
}

export {CommandsDictionary, CommandDescription, CMD_NAMES, CMD_NAME_TYPE}