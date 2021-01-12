import { CreditCardType } from '../enums/credit-card-type.enum';

export const CARD_TYPE_IMAGES = {
  [CreditCardType.Visa]: '/assets/payment/cards/visa.svg',
  [CreditCardType.Mastercard]: '/assets/payment/cards/mastercard.svg',
  [CreditCardType.Amex]: '/assets/payment/cards/amex.svg',
  [CreditCardType.Discover]: '/assets/payment/cards/discover.svg',
  bank: '/assets/payment/bank.svg',
}
