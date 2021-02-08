import { Component } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { Country, FsAddress } from '@firestitch/address';
import { CreditCard } from '@firestitch/package';

@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  public config = {};
  public creditCardConfig = {
    // name: { readonly: true },
    // number: { readonly: true },
    // cvv: { readonly: true },
  };
  public creditCard: CreditCard = {
    name: 'Bob Smith',
    number: '4242424242424242',
    expiryMonth: '1',
    expiryYear: '2028',
  }
  public address: FsAddress = { country: Country.Canada };

  constructor(private exampleComponent: FsExampleComponent,
              private message: FsMessage) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }

  public changed(event) {
    console.log(event);
  }

  public save() {
    this.message.success('Submitted');
  }
}
