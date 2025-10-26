import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';


import { Country, FsAddress } from '@firestitch/address';
import { FsMessage } from '@firestitch/message';
import { CreditCardConfig, FsStripeCreditCardComponent, PaymentMethodCreditCard, Provider } from '@firestitch/package';

import { tap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { FsFormModule } from '@firestitch/form';
import { FsStripeCreditCardComponent as FsStripeCreditCardComponent_1 } from '../../../../src/app/components/stripe-credit-card/stripe-credit-card.component';
import { MatButton } from '@angular/material/button';
import { FsStripeExpressCheckoutElementComponent } from '../../../../src/app/components/stripe-express-checkout-element/stripe-express-checkout-element.component';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'app-stripe-credit-card',
    templateUrl: './stripe-credit-card.component.html',
    styleUrls: ['./stripe-credit-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FsFormModule,
        FsStripeCreditCardComponent_1,
        MatButton,
        FsStripeExpressCheckoutElementComponent,
        JsonPipe,
    ],
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
