const adminUsername = '@mtwkarp'

const replyMessages = {
    schedule: {
        confirmedScheduleReply: 'Дякую ! Вже надсилаю розклад пиздюку з евакуації.',
        scheduleMarkupDescription: 'Виберіть дні в які ви зможете викладати',
        scheduleAlreadyConfirmed: 'Розклад вже надісланий, для його коригування використайте команду для запису в розклад ще раз.',
        chosenScheduleMarkupNotActive: 'Ця розкладка для запису у розклад вже не активна, пролистайте нижче і користуйтеся останньою.',
        scheduleClosed: 'Наразі запис закритий. Запис стартує о 18:00 кожний четвер і закінчується в неділю о 18:00',
        scheduleMustBeFilledBeforeSending: 'Виберіть в які дні можете викладати, або відмітьте свою недоступність перед відправкою. Наразі жодний з варіантів не вибраний.',
        userNotASMInstructor: `Наразі вас немає у списку ASM інструкторів. Повідомте про це ${adminUsername}.`
    }
}

module.exports = replyMessages