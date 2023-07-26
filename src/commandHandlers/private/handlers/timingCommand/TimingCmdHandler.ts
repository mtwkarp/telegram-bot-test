import PrivateCmdHandler from '../../PrivateCmdHandler';
import {CMD_NAMES} from '../../../../types/enums';
import {IPrivateContextDecorator} from '../../../../tglib/tgTypes/contextDecoratorTypes';
import {IPrivateTextPayload} from '../../../../tglib/tgTypes/messagePayload/contextPayloadTypes';
import {addMinutes, format, newValidDate} from "ts-date";
import TimingsCollection from "../../../../db/firestore/collectionManagers/implementations/TimingsCollection";

export default class TimingCmdHandler extends PrivateCmdHandler {
    constructor(userId: number) {
        super(userId, CMD_NAMES.SEND_TIMING);
    }

    protected override onCommand(contextDecorator: IPrivateContextDecorator): void {
        this.sendMessage('Надішли мені час старту занять у наступному форматі - 10:40.');
    }

    protected override async onText(contextDecorator: IPrivateContextDecorator): Promise<void> {
        const payload = contextDecorator.payload as IPrivateTextPayload;
        const result = this.validateTimeFormat(payload.text);

        if(typeof result === 'boolean') {
            const message = this.generateTiming(payload.text);

            await this.tg.sendMessage(process.env.TELEGRAM_CHANNEL_ID as string, message);
        }else {
            await this.sendMessage(result as string);
        }
    }

    private generateTiming(startTime: string): string {
        const splitTime = startTime.split(':')
        const hour = Number(splitTime[0])
        const minute = Number(splitTime[1])
        const timingMinutes = TimingsCollection.getInstance().getCenterTiming()

        const timingsArr: string[] = []
        let validDate = newValidDate(2022, 6, 3, hour, minute)
        let previousDate = newValidDate(2022, 6, 3, hour, minute)

        // @ts-ignore
        timingsArr.push(format(validDate, 'HH:mm'))

        for (let i = 0; i < timingMinutes.length; i++) {
            validDate = addMinutes(validDate, timingMinutes[i])

            const formatted = format(validDate, 'HH:mm')
            const formattedPrevious = format(previousDate, 'HH:mm')

            if(formatted) {
                if(i > 0 && formattedPrevious) {
                    timingsArr.push(formattedPrevious)
                }
                timingsArr.push(formatted)
            }

            previousDate = validDate
        }

        return this.generateMessage(timingsArr)
    }

    private generateMessage(timings: string[]): string {
        return `ГРАФІК 🕰\n
🩸M ${timings[0]}-${timings[1]}\n 
        
🏝Перерва ${timings[2]}-${timings[3]}\n
        
🫁${timings[4]}-${timings[5]}\n
        
🍔Обід ${timings[6]} - ${timings[7]}\n 
            
🫨CH ${timings[8]} - ${timings[9]}\n 
          
🏝Перерва ${timings[10]} - ${timings[11]}\n 
            
🚑Евакуація ${timings[12]} - ${timings[13]}\n 
            
🏝Перерва ${timings[14]} - ${timings[15]}\n 
            
🎪Демонстрація алгоритму інструктором на базі ${timings[16]} - ${timings[17]}\n 
            
🧠Синтез алгоритму на своїх базах ${timings[18]} - ${timings[19]}\n 
            
🏝Перерва ${timings[20]} - ${timings[21]}\n 
            
💻СИМУЛЯЦІЯ ${timings[22]} - ${timings[23]}\n 
             
📣Дебрифінг по симуляції з курсантами ${timings[24]} - ${timings[25]}\n
            
Збір стафу (веселіться скільки хочете).
        `
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