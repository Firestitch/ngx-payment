import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { isNumeric } from '@firestitch/common';

import { endOfMonth, isAfter } from 'date-fns';

import { CARD_TYPE_IMAGES } from '../../consts/card-type-images.const';
import { CreditCardType } from '../../enums/credit-card-type.enum';
import { creditCardNumber } from '../../helpers/credit-card-number';
import { NgClass } from '@angular/common';
import { FsDateModule } from '@firestitch/date';


@Component({
    selector: 'fs-payment-method-credit-card',
    styleUrls: ['./payment-method-credit-card.component.scss'],
    templateUrl: './payment-method-credit-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { 'class': 'fs-payment-method' },
    standalone: true,
    imports: [NgClass, FsDateModule],
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

  @Input()
  public expiryDate: Date;

  public formattedNumber: string;
  public expired = false;

  public cardImages: Partial<Record<CreditCardType, string>> = CARD_TYPE_IMAGES;

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.number && changes.number.currentValue !== changes.number.previousValue) {
      this.formattedNumber = creditCardNumber(this.number, false);
    }
    
    if(changes.expiryMonth || changes.expiryYear) {
      this.expiryDate = null;

      if(isNumeric(this.expiryMonth) && isNumeric(this.expiryYear)) {
        const expiryYear = Number(this.expiryYear);
        const year = expiryYear < 2000 ? expiryYear + 2000 : expiryYear;
        const month = Number(this.expiryMonth);
        this.expiryDate = new Date(year, month - 1);
      }

      this.expired = isAfter(new Date(), endOfMonth(this.expiryDate));
    }
  }
}
