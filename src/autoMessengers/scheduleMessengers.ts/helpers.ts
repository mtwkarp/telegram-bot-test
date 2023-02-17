import ReplyMsgCollection from '../../db/firestore/collectionManagers/implementations/ReplyMsgCollection';


export function renderOneDayScheduleFromSheet(scheduleStrings: string[][]): string {
    let fullScheduleString = '';

    for (let i = 0; i < scheduleStrings.length; i++) {
        if (scheduleStrings[i].length === 0) continue;

        const str: string = scheduleStrings[i][0];
        let paragraph = '\n';

        if (i > 1) paragraph = '\n\n';

        fullScheduleString = fullScheduleString + paragraph + str;
    }

    return fullScheduleString;
}

//refactor
export function renderNextDayInstructorReminderMessage(tomorrowInstructorsByBase: Record<string, Array<{ name: string, chatId: string }>>, repliesCollection: ReplyMsgCollection): {chatId: string, message: string}[] {
    const finalMessagesArr: {chatId: string, message: string}[] = [];

    const basesTranslation: Record<string, string> = {
        ['blood']: 'M🩸',
        ['lungs']: 'AR🫁',
        ['heart']: 'CH❤',
        ['evacuation']: 'еякуляція🚑'
    };

    const basesByInstructor: Record<string, string[]> = {};

    const instructorsInfo: Record<string, { name: string, chatId: string }> = {};

    for (const baseName in tomorrowInstructorsByBase) {
        const instructorsData = tomorrowInstructorsByBase[baseName];

        for (let i = 0; i < instructorsData.length; i++) {
            const { name } = instructorsData[i];

            if (instructorsInfo[name] === undefined) instructorsInfo[name] = instructorsData[i];
            if (basesByInstructor[name] === undefined) basesByInstructor[name] = [];

            basesByInstructor[name].push(baseName);
        }
    }

    for (const instructorName in instructorsInfo) {
        const instructorsData = instructorsInfo[instructorName];

        const {chatId, name} = instructorsData;
        let firstName = name.split(' ')[1];

        if (firstName === undefined) firstName = name.split(' ')[0];
        let message = repliesCollection.getScheduleCmdReply('every_day_instructor_reminder');
        let replace2 = '';

        if (basesByInstructor[name].length === 1) {
            message = repliesCollection.getScheduleCmdReply('every_day_instructor_reminder');
            replace2 = basesTranslation[basesByInstructor[name][0]];
        } else {
            message = repliesCollection.getScheduleCmdReply('every_day_instructor_reminder_2');
            for (let j = 0; j < basesByInstructor[name].length; j++) {
                const instructorBase = basesByInstructor[name][j];
                const baseLabel = basesTranslation[instructorBase];

                replace2 += `\n- ${baseLabel}`;
            }
        }

        message = message.replace('$1', firstName);
        message = message.replace('$2', replace2);

        finalMessagesArr.push({chatId, message});
    }

    return finalMessagesArr;
}