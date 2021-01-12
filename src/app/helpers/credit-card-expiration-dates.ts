export function creditCardExpirationDates(
  cardExpiryMonth: number | string,
  cardExpiryYear: number | string
): string {
  cardExpiryMonth = cardExpiryMonth.toString();

  return `${cardExpiryMonth.padStart(2, '0')}/${cardExpiryYear}`;
}
