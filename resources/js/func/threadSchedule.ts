import dayjs from 'dayjs'

export function threadScheduleRange() {
    const now = dayjs.tz()
    let first = now.startOf('day').hour(8)
    if (!first.isAfter(now)) first = first.add(1, 'day')
    return { first: first.format('YYYY-MM-DD'), last: first.add(6, 'day').format('YYYY-MM-DD') }
}

export function isThreadScheduleDateValid(date: string) {
    const { first, last } = threadScheduleRange()
    return date >= first && date <= last
}

export function threadScheduleLabel(date: string) {
    const [, month, day] = date.slice(0, 10).split('-')
    return `将在${Number(month)}月${Number(day)}日8点发出`
}
