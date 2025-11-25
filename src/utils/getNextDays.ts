export function getNextDays(amount: number): number[] {
    const today = new Date();
    const days: number[] = [];

    for (let i = 0; i < amount; i++) {
        const next = new Date(today);
        next.setDate(today.getDate() + i);

        days.push(next.getDate());
    }

    return days;
}
