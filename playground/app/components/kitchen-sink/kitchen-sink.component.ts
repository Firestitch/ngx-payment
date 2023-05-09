import { Component } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { Country, FsAddress } from '@firestitch/address';
import { CreditCard, CreditCardConfig } from '@firestitch/package';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  public config = {};
  public creditCardConfig: CreditCardConfig = {
    // name: { readonly: true },
    number: { readonly: false, hint: 'Hint!' },
    // cvv: { readonly: true },
    appearance: 'outline',
  };
  public creditCard: CreditCard = {
    name: 'Bob Smith',
    number: '4242424242424242',
  }
  public address: FsAddress = { country: Country.Canada };

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage
  ) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }

  public changed(event) {
    console.log(event);
  }

  public save() {
    this.message.success('Submitted');
  }
}
