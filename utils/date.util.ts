/**
 * Builds a card expiration date in MM/YYYY format, offset from today.
 *
 * The day is normalised to the 1st before shifting the month, otherwise
 * month-end dates overflow: on 31 August, +3 months targets 31 November,
 * which JavaScript rolls forward to 1 December and yields the wrong month.
 */
export function getExpirationDate(monthsAhead = 3): string {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + monthsAhead);

    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${month}/${date.getFullYear()}`;
}
