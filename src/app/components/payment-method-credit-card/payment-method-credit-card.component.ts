import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { creditCardNumber } from '../../helpers/credit-card-number';
import { creditCardExpirationDates } from '../../helpers/credit-card-expiration-dates';
import { CARD_TYPE_IMAGES } from '../../consts/card-type-images.const';
import { CreditCardType } from '../../enums/credit-card-type.enum';


@Component({
  selector: 'fs-payment-method-credit-card',
  styleUrls: ['./payment-method-credit-card.component.scss'],
  templateUrl: './payment-method-credit-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fs-payment-method',
  },
})
export class PaymentMethodCreditCardComponent implements OnChanges {

  @Input()
  public type: string;

  @Input()
  public number: string | number;

  @Input()
  public expiryMonth: string | number;

  @Input()
  public expiryYear: string | number;

  public formattedNumber: string;
  public formattedExpiryDate: string;

  public cardImages: Partial<Record<CreditCardType, string>> = CARD_TYPE_IMAGES;

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.number && changes.number.currentValue !== changes.number.previousValue) {
      this.formattedNumber = creditCardNumber(this.number, false);
    }

    const datesChanged = (changes.expiryMonth && changes.expiryMonth.currentValue !== changes.expiryMonth.previousValue)
      || (changes.expiryYear && changes.expiryYear.currentValue !== changes.expiryYear.previousValue);

    if (datesChanged) {
      this.formattedExpiryDate = creditCardExpirationDates(this.expiryMonth, this.expiryYear);
    }
  }
}
