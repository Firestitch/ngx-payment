export function creditCardNumber(cardNumber: string | number, showAsterisk = true): string {
  cardNumber = cardNumber.toString();

  if (cardNumber.length < 4) {
    cardNumber = cardNumber.padStart(4, '0');
  } else if (cardNumber.length > 4) {
    cardNumber = cardNumber.slice(-4);
  }

  return `${showAsterisk ? '**** ' : ''}${cardNumber}`;
}
