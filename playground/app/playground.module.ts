import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsPaymentModule } from '@firestitch/package';
import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  KitchenSinkComponent,
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { PaymentMethodDisplayComponent } from './components/payment-method-display/payment-method-display.component';
import { BankAccountUsComponent } from './components/bank-account-us';

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
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
        MatButtonModule,
    ],
    declarations: [
        AppComponent,
        ExamplesComponent,
        KitchenSinkComponent,
        KitchenSinkConfigureComponent,
        BankAccountComponent,
        PaymentMethodDisplayComponent,
        BankAccountUsComponent,
    ]
})
export class PlaygroundModule {
}
