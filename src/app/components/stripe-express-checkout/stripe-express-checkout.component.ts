import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';


import { loadJs } from '@firestitch/common';

import { from, Observable, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { FS_PAYMENT_CONFIG } from '../../injectors';
import {
  PaymentMethodCreditCard,
} from '../../interfaces';


@Component({
  selector: 'fs-stripe-express-checkout',
  templateUrl: './stripe-express-checkout.component.html',
  styleUrls: ['./stripe-express-checkout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class FsStripeExpressCheckoutComponent implements OnInit {

  @ViewChild('expressPaymentElement', { static: true }) 
  public expressPaymentElement: ElementRef;
  
  @Input() public applePayConfig: { buttonType?: string };

  @Input() public googlePayConfig: { buttonType?: string };
  
  @Input() public setupIntents: () => Observable<{ clientSecret: string }>;

  @Output() public confirm: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();
  @Output() public ready: EventEmitter<{
    amazonPay?: boolean;
    applePay?: boolean;
    googlePay?: boolean;
    klarna?: boolean;
    link?: boolean;
    paypal?: boolean;
  }> = new EventEmitter();

  public paymentMethodCreditCard: PaymentMethodCreditCard = {};

  private _stripe;//: stripe.Stripe;
  private _paymentConfig = inject(FS_PAYMENT_CONFIG);

  public ngOnInit() {
    this._initProvider();
  }

  private _initExpressCheckout(clientSecret): void {
    const elements = this._stripe.elements({ 
      clientSecret: clientSecret,
      locale: 'en',
    });

    const expressCheckoutElement = elements.create(
      'expressCheckout',
      {
        buttonType: {
          ...(
            this.applePayConfig ? { applePay: this.applePayConfig?.buttonType || 'plain' } : {}
          ),
          ...(
            this.googlePayConfig ? { googlePay: this.googlePayConfig?.buttonType || 'plain' } : {}
          ),
        },
      },
    );

    expressCheckoutElement.mount(this.expressPaymentElement.nativeElement);

    expressCheckoutElement.on('ready', ({ availablePaymentMethods }) => {
      this.ready.emit(availablePaymentMethods || {});
    });

    expressCheckoutElement.on('confirm', ({ billingDetails, expressPaymentType }) => {
      this.paymentMethodCreditCard = {
        ...this.paymentMethodCreditCard,
        creditCard: {
          ...this.paymentMethodCreditCard.creditCard,
          name: billingDetails.name,
          type: expressPaymentType.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase()),
        },
      };

      from(this._stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: 'if_required', // Only redirect if necessary
      }),
      )
        .pipe(
          switchMap(({ error, setupIntent }) => {
            if(error) {
              return throwError(() => new Error(error));
            }

            if (setupIntent?.status !== 'succeeded') {
              return throwError(() => new Error('Setup intent status is not succeeded'));
            }

            return of({ setupIntent });
          }),
          tap(({ setupIntent }) => {
            this.paymentMethodCreditCard.token = setupIntent.payment_method;
            this.confirm.emit(this.paymentMethodCreditCard);
          }),
        )
        .subscribe();
    });
  }

  private _initProvider(): void {
    loadJs('https://js.stripe.com/v3/')
      .pipe(
        tap(() => {
          this._stripe = (window as any).Stripe(this._paymentConfig?.stripe?.publishableKey);
          console.log('stripe', this._stripe);
        }),
        switchMap(() => {
          return this.setupIntents ? 
            this.setupIntents() : 
            this._paymentConfig?.stripe?.setupIntents();
        }),  
        tap(({ clientSecret }) => {
          this._initExpressCheckout(clientSecret);
        }),
      )
      .subscribe();
  }
}
