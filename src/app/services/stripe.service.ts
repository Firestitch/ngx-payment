import { Injectable, inject } from '@angular/core';

import { loadJs } from '@firestitch/common';

import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { FS_PAYMENT_CONFIG } from '../injectors/payment.injector';


@Injectable({
  providedIn: 'root',
})
export class StripeService {
  
  private _stripe$ = new BehaviorSubject<any>(null);
  private _init$?: Observable<any>;
  private _paymentConfig = inject(FS_PAYMENT_CONFIG);
  
  public get stripe(): any {
    const value = this._stripe$.getValue();
    if (!value) {
      throw new Error('Stripe not initialized. Call init() first.');
    }

    return value;
  }

  public supportedPaymentMethods(): Observable<{ 
    applePay: boolean
    googlePay: boolean
    link: boolean
  }> {
    return this.init().pipe(
      switchMap(() => {
        const paymentRequest = this.stripe.paymentRequest({
          currency: 'usd',
          country: 'US',
          total: {
            label: 'supportedPaymentMethods',
            amount: 1000,  
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        return from(paymentRequest.canMakePayment())
          .pipe(
            map((result: any) => ({
              applePay: !!result?.applePay,    // Coerce to boolean; false if null/undefined
              googlePay: !!result?.googlePay,
              link: !!result?.link,
            })),
          );
      }),
    );
  }

  public init(): Observable<any> {    
    if (this._stripe$.getValue()) {
      // Already initialized, return the current value as observable
      return this._stripe$.pipe(map((value) => value!));
    }

    if (!this._init$) {
      // First call: create the shared loading observable
      this._init$ = loadJs('https://js.stripe.com/v3/')
        .pipe(
          tap(() => {
            const stripeInstance = (window as any)
              .Stripe(this._paymentConfig?.stripe?.publishableKey);
            this._stripe$.next(stripeInstance);
          }),
          map(() => this._stripe$.getValue()!),
          shareReplay(1), // Shares the observable: concurrent subscribers get the same execution, caches the result
        );
    }

    // Return the shared observable (either loading or cached)
    return this._init$;
  }
}
