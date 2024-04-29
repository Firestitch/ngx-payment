import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FsAddressModule } from '@firestitch/address';
import { FsDateModule } from '@firestitch/date';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMaskModule } from '@firestitch/mask';

import { FsDatePickerModule } from '@firestitch/datepicker';
import {
  FsBankAccountComponent, FsCreditCardComponent,
  FsCreditCardStripeComponent,
  PaymentMethodBankComponent, PaymentMethodCreditCardComponent
} from './components';


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
    FsMaskModule,
  ],
  exports: [
    FsCreditCardComponent,
    FsBankAccountComponent,
    PaymentMethodBankComponent,
    PaymentMethodCreditCardComponent,
    FsCreditCardStripeComponent,
  ],
  declarations: [
    FsCreditCardComponent,
    FsBankAccountComponent,
    PaymentMethodBankComponent,
    PaymentMethodCreditCardComponent,
    FsCreditCardStripeComponent,
  ],
})
export class FsPaymentModule {
  static forRoot(): ModuleWithProviders<FsPaymentModule> {
    return {
      ngModule: FsPaymentModule
    };
  }
}
