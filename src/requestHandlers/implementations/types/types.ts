import {Message} from 'typegram';

export type ScheduleFullMessages = {
    fullScheduleCenterMsg: Message.TextMessage | undefined,
    fullScheduleTripsMsg: Message.TextMessage | undefined
}