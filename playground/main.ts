import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_PAYMENT_CONFIG, FsPaymentConfig, FsPaymentModule } from '@firestitch/package';
import { of } from 'rxjs';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsFormModule } from '@firestitch/form';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FsPaymentModule, FormsModule, FsLabelModule, FsFormModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true }), MatButtonModule),
        {
            provide: FS_PAYMENT_CONFIG,
            useFactory: (): FsPaymentConfig => ({
                stripe: {
                    publishableKey: 'pk_test_Nt67M3jtxEMwQrjBeQBFtYMc',
                    setupIntents: () => {
                        return of({ clientSecret: 'seti_1SATeg2eK62UbN9HHbHPPKAw_secret_T6h2TuXI0lvcc7o35Qb7AUFsJF3l8Md' });
                    },
                },
                square: {
                    applicationId: 'sandbox-sq0idb-RT3u-HhCpNdbMiGg5aXuVg',
                    locationId: 'TC4Z3ZEBKRXRH',
                },
                production: false,
            }),
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { floatLabel: 'auto', appearance: 'outline' },
        },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

