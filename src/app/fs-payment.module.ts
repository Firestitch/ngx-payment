import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FsAddressModule } from '@firestitch/address';
import { FsDateModule } from '@firestitch/date';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMaskModule } from '@firestitch/mask';

import {
  FsBankAccountComponent, FsCreditCardComponent,
  FsSquareCreditCardComponent,
  FsStripeCreditCardComponent,
  FsStripeExpressCheckoutComponent,
  PaymentMethodBankComponent, PaymentMethodCreditCardComponent,
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
    FsSquareCreditCardComponent,
  ],
  exports: [
    FsCreditCardComponent,
    FsBankAccountComponent,
    PaymentMethodBankComponent,
    PaymentMethodCreditCardComponent,
    FsStripeCreditCardComponent,
    FsSquareCreditCardComponent,
    FsStripeExpressCheckoutComponent,
  ],
  declarations: [
    FsCreditCardComponent,
    FsBankAccountComponent,
    PaymentMethodBankComponent,
    PaymentMethodCreditCardComponent,
    FsStripeCreditCardComponent,
    FsStripeExpressCheckoutComponent,
  ],
})
export class FsPaymentModule {
  public static forRoot(): ModuleWithProviders<FsPaymentModule> {
    return {
      ngModule: FsPaymentModule,
    };
  }
}
