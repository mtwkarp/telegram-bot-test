type CommandDescription= {
    readonly command: string,
    readonly description: string
}

type CommandsDictionary = {
    [cmdName: string]: CommandDescription
}

export {CommandsDictionary, CommandDescription}