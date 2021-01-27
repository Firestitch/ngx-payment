import { FsAddress } from '@firestitch/address';

// NOTE: fields which has '0' as a first number can't be integer. Any numeric types of variables
// automatically removing first zero digits

export interface PaymentMethodCreditCard {
  address?: FsAddress;
  creditCard?: CreditCard;
}

export interface CreditCard {
  name?: string;
  number?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  type?: string;
}
