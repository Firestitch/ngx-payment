import { Injectable, inject } from '@angular/core';

import { loadJs } from '@firestitch/common';

import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';

import { FS_PAYMENT_CONFIG } from '../injectors/payment.injector';
import { FsPaymentStripeSetupIntent } from '../interfaces/stripe-setup-intent.interface';


@Injectable({
  providedIn: 'root',
})
export class FsPaymentStripe {

  private _stripe$ = new BehaviorSubject<any>(null);
  private _init$?: Observable<any>;
  // Optional, so an app that takes its key from the setup intent need not provide the config.
  private _paymentConfig = inject(FS_PAYMENT_CONFIG, { optional: true });

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

  /**
   * Loads Stripe.js and creates the one Stripe instance the app shares.
   *
   * `publishableKey` takes precedence over the key in `FS_PAYMENT_CONFIG`, for apps that only
   * receive it with a setup intent. Stripe.js is loaded once per document, so the first call
   * decides the key and every later call shares that instance.
   */
  public init(publishableKey?: string): Observable<any> {
    if (this._stripe$.getValue()) {
      // Already initialized, return the current value as observable
      return this._stripe$.pipe(map((value) => value!));
    }

    if (!this._init$) {
      const key = publishableKey || this._paymentConfig?.stripe?.publishableKey;

      if (!key) {
        return throwError(() => new Error('Stripe publishable key is not configured'));
      }

      // First call: create the shared loading observable
      this._init$ = loadJs('https://js.stripe.com/v3/')
        .pipe(
          tap(() => {
            const stripeInstance = (window as any).Stripe(key);
            this._stripe$.next(stripeInstance);
          }),
          map(() => this._stripe$.getValue()!),
          shareReplay(1), // Shares the observable: concurrent subscribers get the same execution, caches the result
        );
    }

    // Return the shared observable (either loading or cached)
    return this._init$;
  }

  /**
   * Fetches a setup intent, then initializes Stripe with the key it carries, if it carries one.
   *
   * The intent comes first so that its `publishableKey` can reach `init()`. `getSetupIntent`
   * falls back to `FS_PAYMENT_CONFIG.stripe.setupIntents`.
   */
  public initSetupIntent(
    getSetupIntent?: () => Observable<FsPaymentStripeSetupIntent>,
  ): Observable<FsPaymentStripeSetupIntent> {
    getSetupIntent = getSetupIntent || this._paymentConfig?.stripe?.setupIntents;

    if (!getSetupIntent) {
      return throwError(() => new Error('No Stripe setupIntents provided'));
    }

    return getSetupIntent()
      .pipe(
        switchMap((setupIntent) => this.init(setupIntent.publishableKey)
          .pipe(
            take(1),
            map(() => setupIntent),
          )),
      );
  }
}
