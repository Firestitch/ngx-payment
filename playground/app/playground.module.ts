import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

import { FsExampleModule } from '@firestitch/example';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FS_PAYMENT_CONFIG, FsPaymentConfig, FsPaymentModule } from '@firestitch/package';
import { ToastrModule } from 'ngx-toastr';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import {
  CreditCardComponent,
  ExamplesComponent,
} from './components';
import { BankAccountUsComponent } from './components/bank-account-us';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { PaymentMethodDisplayComponent } from './components/payment-method-display/payment-method-display.component';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsPaymentModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsFormModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, {}),
    MatButtonModule,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    CreditCardComponent,
    BankAccountComponent,
    PaymentMethodDisplayComponent,
    BankAccountUsComponent,
  ],
  providers: [
    {
      provide: FS_PAYMENT_CONFIG,
      useFactory: () => ({
        stripe: {
          publishableKey: 'pk_test_Nt67M3jtxEMwQrjBeQBFtYMc',
          setupIntents: () => {
            return of({ clientSecret: 'seti_1PArsr2eK62UbN9HAH6XeYUf_secret_Q0tgYbkwCQ26A4nXHUYmkvXUsvuyICE' });
          }
        },
      } as FsPaymentConfig)
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: 'auto', appearance: 'outline' },
    },
  ]
})
export class PlaygroundModule {
}
