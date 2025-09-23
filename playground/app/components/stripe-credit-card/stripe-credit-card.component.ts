import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';


import { Country, FsAddress } from '@firestitch/address';
import { FsMessage } from '@firestitch/message';
import { CreditCardConfig, FsStripeCreditCardComponent, PaymentMethodCreditCard, Provider } from '@firestitch/package';

import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-stripe-credit-card',
  templateUrl: './stripe-credit-card.component.html',
  styleUrls: ['./stripe-credit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeCreditCardComponent {

  @ViewChild(FsStripeCreditCardComponent)
  public stripe: FsStripeCreditCardComponent;

  public config = {};
  public expressPaymentMethodCreditCard: PaymentMethodCreditCard;
  public expressCheckoutSupported = false;
  public Provider = Provider;
  public creditCardConfig: CreditCardConfig = {
    number: { readonly: false, hint: 'Hint!' },
    appearance: 'outline',
  };

  public paymentMethodCreditCard: PaymentMethodCreditCard;

  public address: FsAddress = { country: Country.Canada };

  constructor(
    private _message: FsMessage,
  ) {
  }

  public changed(event) {
    console.log(event);
  }

  public submit = () => {
    return this.stripe.createCard()
      .pipe(
        tap((paymentMethodCreditCard: PaymentMethodCreditCard) => {
          this._message.info(`Token: ${paymentMethodCreditCard.token}`);
        }),
      );
  };

  public save() {
    this._message.success('Submitted');
  }
}
