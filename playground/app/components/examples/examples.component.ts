import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { PaymentMethodDisplayComponent } from '../payment-method-display/payment-method-display.component';
import { CreditCardComponent } from '../credit-card/credit-card.component';
import { StripeCreditCardComponent } from '../stripe-credit-card/stripe-credit-card.component';
import { SquareCreditCardComponent } from '../square-credit-card/square-credit-card.component';
import { BankAccountComponent } from '../bank-account/bank-account.component';
import { BankAccountUsComponent } from '../bank-account-us/bank-account-us.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, PaymentMethodDisplayComponent, CreditCardComponent, StripeCreditCardComponent, SquareCreditCardComponent, BankAccountComponent, BankAccountUsComponent]
})
export class ExamplesComponent {
  public config = environment;
}
