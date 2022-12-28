import {CommandsDictionary, CommandDescription} from "./commandTypes";

interface IBotInteractionListener {
    onCallbackQuery: Function;
    onMessage: Function;
    onCmd: Function
}

export {IBotInteractionListener, CommandsDictionary, CommandDescription}