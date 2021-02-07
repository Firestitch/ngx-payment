export function creditCardExpirationDates(
  cardExpiryMonth: number | string,
  cardExpiryYear: number | string
): string {
  cardExpiryMonth = cardExpiryMonth.toString();
  cardExpiryMonth = cardExpiryMonth
    .substr(cardExpiryMonth.length - 2)
    .padStart(2, '0');
  cardExpiryYear = cardExpiryYear.toString();
  cardExpiryYear = cardExpiryYear
    .substr(cardExpiryYear.length - 2)
    .padStart(2, '0');

  return `${cardExpiryMonth}/${cardExpiryYear}`;
}
