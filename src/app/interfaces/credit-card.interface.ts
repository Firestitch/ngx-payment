import { MatFormFieldAppearance } from '@angular/material/form-field';

import { FsAddress } from '@firestitch/address';

// NOTE: fields which has '0' as a first number can't be integer. Any numeric types of variables
// automatically removing first zero digits

export interface PaymentMethodCreditCard {
  token?: string;
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

export interface CreditCardFieldConfig {
  readonly?: boolean;
  hint?: string;
}

export interface CreditCardConfig {
  showAddress?: boolean;
  name?: CreditCardFieldConfig;
  number?: CreditCardFieldConfig;
  expiry?: CreditCardFieldConfig;
  cvv?: CreditCardFieldConfig;
  appearance?: MatFormFieldAppearance;
}
