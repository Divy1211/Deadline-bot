export interface Reminders {
    [timestamp: number]: {
        userIds: string[],
    }
}

export interface Deadline {
    createdBy: string,
    desc: string,
    link: string,
    name: string,
    timestamp: number,
    reminders: Reminders,
}