import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';


import { Country, FsAddress } from '@firestitch/address';
import { FsMessage } from '@firestitch/message';
import { CreditCard, CreditCardConfig, FsCreditCardStripeComponent, Provider } from '@firestitch/package';

import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-stripe-credit-card',
  templateUrl: './stripe-credit-card.component.html',
  styleUrls: ['./stripe-credit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripeCreditCardComponent {

  @ViewChild(FsCreditCardStripeComponent)
  public stripe: FsCreditCardStripeComponent;

  public config = {};
  public Provider = Provider;
  public creditCardConfig: CreditCardConfig = {
    number: { readonly: false, hint: 'Hint!' },
    appearance: 'outline',
  };

  public creditCard: CreditCard = {
    name: 'Bob Smith',
    number: '',
  };

  public address: FsAddress = { country: Country.Canada };

  constructor(
    private _message: FsMessage,
  ) {
  }

  public changed(event) {
    console.log(event);
  }

  public submit = () => {
    return this.stripe.createToken()
      .pipe(
        tap((token) => {
          this._message.info(token);
        }),
      );
  };

  public save() {
    this._message.success('Submitted');
  }
}
