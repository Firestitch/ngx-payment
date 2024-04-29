import { Component, ViewChild } from '@angular/core';
import { Country, FsAddress } from '@firestitch/address';
import { FsMessage } from '@firestitch/message';
import { CreditCard, CreditCardConfig, FsCreditCardStripeComponent, Provider } from '@firestitch/package';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {

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
    number: '4242424242424242',
  }

  public address: FsAddress = { country: Country.Canada };

  constructor(
    private _message: FsMessage
  ) {
  }

  public changed(event) {
    console.log(event);
  }

  public submitStripe = () => {
   return this.stripe.createToken()
    .pipe(
      tap((token) => {
        debugger;
        this._message.info(token);
      })
    );
  }

  public save() {
    this._message.success('Submitted');
  }
}
