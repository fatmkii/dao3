export function shuffleArray<T>(array: T[] | undefined): T[] {
    if (array !== undefined) {
        const shuffledArray = [...array]; // 复制数组，以免修改原始数组

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }

        return shuffledArray;
    } else {
        return []
    }
}