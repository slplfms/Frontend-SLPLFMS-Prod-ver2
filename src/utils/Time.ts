import dayjs from "dayjs";


export type RangeDateList = {
    date: string;
    day: string;
}[]

export function getDatesInRange(start: string, end: string) {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    const dates = [];
    let current = startDate.clone();
    while (current.isBefore(endDate)) {
        dates.push({
            date: current.format("YYYY-MM-DD"),
            day: current.format("dddd")
        });
        current = current.add(1, 'day');
    }

    return dates;
}
