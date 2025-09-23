import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { Country, FsAddress } from '@firestitch/address';
import { FsMessage } from '@firestitch/message';
import { CreditCard, CreditCardConfig, FsSquareCreditCardComponent, PaymentMethodCreditCard, Provider } from '@firestitch/package';

import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-square-credit-card',
  templateUrl: './square-credit-card.component.html',
  styleUrls: ['./square-credit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SquareCreditCardComponent {

  @ViewChild(FsSquareCreditCardComponent)
  public square: FsSquareCreditCardComponent;

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
    return this.square.createCard()
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
