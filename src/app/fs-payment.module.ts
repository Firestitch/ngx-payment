import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatIconModule } from '@angular/material/icon'

import { FsAddressModule } from '@firestitch/address';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsDateModule } from '@firestitch/date';

import { FsCreditCardComponent } from './components/credit-card/credit-card.component';
import { FsBankAccountComponent } from './components/bank-account/bank-account.component';
import { PaymentMethodBankComponent } from './components/payment-method-bank/payment-method-bank.component';
import { PaymentMethodCreditCardComponent } from './components/payment-method-credit-card/payment-method-credit-card.component';
import { FsDatePickerModule } from '@firestitch/datepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,

    FsAddressModule,
    FsFormModule,
    FsLabelModule,
    FsDatePickerModule,
    FsDateModule,
  ],
  exports: [
    FsCreditCardComponent,
    FsBankAccountComponent,
    PaymentMethodBankComponent,
    PaymentMethodCreditCardComponent,
  ],
  declarations: [
    FsCreditCardComponent,
    FsBankAccountComponent,
    PaymentMethodBankComponent,
    PaymentMethodCreditCardComponent,
  ],
})
export class FsPaymentModule {
  static forRoot(): ModuleWithProviders<FsPaymentModule> {
    return {
      ngModule: FsPaymentModule
    };
  }
}
