let timeoutId: NodeJS.Timeout;
function useDebounce<T extends (...args: any[]) => any>(func: T, delay: number = 500) {
    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args)
        }, delay)
    }
}

export { useDebounce } 