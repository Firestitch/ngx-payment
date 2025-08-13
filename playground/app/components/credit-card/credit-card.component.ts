import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Country, FsAddress } from '@firestitch/address';
import { FsMessage } from '@firestitch/message';
import { CreditCard, CreditCardConfig, Provider } from '@firestitch/package';


@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardComponent {

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

  public save() {
    this._message.success('Submitted');
  }
}
