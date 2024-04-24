//NInputNumber的千分位
export function inputNumberParse(input: string) {
    const nums = input.replace(/,/g, '').trim()
    if (/^-?\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
    return nums === '' ? null : Number.NaN
}
export function inputNumberFormat(value: number | null) {
    if (value === null) return ''
    return value.toLocaleString('en-US')
}
