import PrivateCmdHandler from '../../PrivateCmdHandler';
import {CMD_NAMES} from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivateTextPayload} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';

export default class TimingCmdHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId, CMD_NAMES.SEND_TIMING);
    }

    protected override onCommand(contextDecorator: IPrivateContextDecorator): void {
        this.sendMessage('Надішли мені час старту занять у наступному форматі - 10:40.');
    }

    protected override onText(contextDecorator: IPrivateContextDecorator): void {
        const payload = contextDecorator.payload as IPrivateTextPayload;
        const result = this.validateTimeFormat(payload.text);

        if(typeof result === 'boolean') {
            this.generateTiming(payload.text);
        }else {
            this.sendMessage(result as string);
        }
    }

    private generateTiming(time: string): void {
        this.sendMessage('generate timing');
    }

    private validateTimeFormat(timeString: string): string | boolean {
        // Regular expression to match the time format "HH:mm"
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

        if (timeRegex.test(timeString)) {
            return true;
        } else {
            return 'Невірний формат часу. Формат повинен бути "HH:mm", де HH - години (від 00 до 23), а mm - хвилини (від 00 до 59).';
        }
    }
    copy(): PrivateCmdHandler {
        return new TimingCmdHandler(this.id);
    }
}