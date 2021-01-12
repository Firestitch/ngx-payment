import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { bankAccountNumber } from '../../helpers/bank-account-number';
import { CARD_TYPE_IMAGES } from '../../consts/card-type-images.const';


@Component({
  selector: 'fs-payment-method-bank',
  templateUrl: './payment-method-bank.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fs-payment-method',
  },
})
export class PaymentMethodBankComponent implements OnChanges {

  @Input()
  public number: string | number;

  public formattedNumber: string;

  public bankImagePath = CARD_TYPE_IMAGES.bank;

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.number && changes.number.currentValue !== changes.number.previousValue) {
      this.formattedNumber = bankAccountNumber(this.number);
    }
  }
}
