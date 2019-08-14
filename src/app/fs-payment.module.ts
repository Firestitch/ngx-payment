import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsCreditCardComponent } from './components/credit-card/credit-card.component';
import { MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FsAddressModule } from '@firestitch/address';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    FsAddressModule
  ],
  exports: [
    FsCreditCardComponent,
  ],
  entryComponents: [
  ],
  declarations: [
    FsCreditCardComponent,
  ]
})
export class FsPaymentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsPaymentModule
    };
  }
}
