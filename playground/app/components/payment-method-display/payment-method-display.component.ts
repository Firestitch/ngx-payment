import { Component } from '@angular/core';
import { PaymentMethodCreditCardComponent } from '../../../../src/app/components/payment-method-credit-card/payment-method-credit-card.component';
import { PaymentMethodBankComponent } from '../../../../src/app/components/payment-method-bank/payment-method-bank.component';


@Component({
    selector: 'payment-method-display',
    templateUrl: './payment-method-display.component.html',
    styleUrls: ['./payment-method-display.component.scss'],
    standalone: true,
    imports: [PaymentMethodCreditCardComponent, PaymentMethodBankComponent]
})
export class PaymentMethodDisplayComponent {

  public config = {};

  constructor() {
  }
}
