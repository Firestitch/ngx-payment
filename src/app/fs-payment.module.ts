import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsCreditCardComponent } from './components/credit-card/credit-card.component';
import { MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FsAddressModule } from '@firestitch/address';
import { FsBankAccountComponent } from './components/bank-account/bank-account.component';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    FsAddressModule,
    FsFormModule,
    FsLabelModule
  ],
  exports: [
    FsCreditCardComponent,
    FsBankAccountComponent
  ],
  declarations: [
    FsCreditCardComponent,
    FsBankAccountComponent
  ]
})
export class FsPaymentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsPaymentModule
    };
  }
}
