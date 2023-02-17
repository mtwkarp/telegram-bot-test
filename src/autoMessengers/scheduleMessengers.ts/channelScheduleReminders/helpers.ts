

export function renderOneDayScheduleFromSheet(scheduleStrings: string[][]) {
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