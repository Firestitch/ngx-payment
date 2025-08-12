import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';


import { IFsAddressConfig } from '@firestitch/address';
import { loadJs } from '@firestitch/common';

import { from, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FS_PAYMENT_CONFIG } from '../../injectors';
import {
  CreditCard, CreditCardConfig,
  PaymentMethodCreditCard,
} from '../../interfaces';

//declare let Stripe; // : stripe.StripeStatic;


@Component({
  selector: 'fs-credit-card-stripe',
  templateUrl: './credit-card-stripe.component.html',
  styleUrls: ['./credit-card-stripe.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class FsCreditCardStripeComponent implements OnInit, OnChanges {

  @ViewChild('dummyInput', { static: true }) 
  public dummyInput: ElementRef;

  @ViewChild('cardElement', { static: true }) 
  public cardElement: ElementRef;

  @Input() public config: CreditCardConfig = {};
  @Input() public creditCard: CreditCard = {};
  @Input() public setupIntents: () => Observable<{ clientSecret: string }>;

  @Input()
  public addressConfig: IFsAddressConfig = {
      name: { visible: false },
      street: { required: true },
      city: { required: true },
      region: { required: true },
      zip: { required: true },
      country: { required: true },
    };

  @Output() public changed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public initailized = false;
  public cardErrors = '';
  public card;

  private _stripe;//: stripe.Stripe;
  private _card;//: stripe.elements.Element;

  private _form = inject(NgForm);
  private _paymentConfig = inject(FS_PAYMENT_CONFIG);
  private _cdRef = inject(ChangeDetectorRef);

  public ngOnInit() {
    this._initProvider();
  }

  public validate = (() => {
    return of(null)
      .pipe(
        switchMap(() => {
          if(this.cardEl.classList.contains('StripeElement--empty')) {
            return throwError('Card number is required');
          }

          if(this.cardErrors) {
            return throwError(this.cardErrors);
          }

          return of(null);
        }),
      );
  });

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.creditCardConfig) {
      this.config = {
        ...
        {
          name: { readonly: false },
          number: { readonly: false },
          expiry: { readonly: false },
          cvv: { readonly: false },
        },
        ...changes.creditCardConfig.currentValue,
      };
    }
  }

  public get cardEl() {
    return this.cardElement.nativeElement;
  }

  public _changed() {
    this.changed.emit({ creditCard: this.creditCard });
  }

  public createToken(): Observable<any> {
    return from(this._stripe.createToken(this._card));
  }

  public createSource(): Observable<any> {
    return from(this._stripe.createSource(this._card));
  }

  public updateAndValidate(message) {
    this.cardErrors = message;
    this._form.controls['cardInput'].markAsDirty();
    this._form.controls['cardInput'].updateValueAndValidity();
  }

  private _initStripe(clientSecret): void {
    const inputStyle = getComputedStyle(this.dummyInput.nativeElement);
    const fontFamily = inputStyle.fontFamily.split(',')
      .map((f) => f.trim())
      .map((f) => f.replace(/["']/g, ''))
      .find(() => true);

    this._stripe = (window as any).Stripe(this._paymentConfig?.stripe?.publishableKey);

    const cssUrl = new URL(`https://fonts.googleapis.com/css2?family=${fontFamily}&display=swap`);
    const elements = this._stripe.elements({ 
      clientSecret: clientSecret,
      locale: 'en',
      fonts: [
        {
          cssSrc: cssUrl.toString(),
        },
      ],
    });

    this._card = elements.create(
      'card',
      {
        style: {
          base: {
            color: inputStyle.color,
            fontWeight: inputStyle.fontWeight,
            fontFamily: fontFamily,
            fontSize: inputStyle.fontSize,
            fontSmoothing: 'antialiased',
          },
        },
      },
    );

    this._card.on('blur', () => {
      let message = '';
      if(this.cardEl.classList.contains('StripeElement--invalid')) {
        message = 'The card is invalid';
      }
      
      this.updateAndValidate(message);
    });

    this._card.on('change', (event) => {
      this.updateAndValidate(event.error?.message);
      this._cdRef.markForCheck();
    });
    
    this._card.mount(this.cardEl);
  }

  private _initProvider(): void {
    loadJs('https://js.stripe.com/v3/')
      .pipe(
        switchMap(() => {
          return this.setupIntents ? 
            this.setupIntents() : 
            this._paymentConfig?.stripe?.setupIntents();
        }),        
      )
      .subscribe(({ clientSecret }) => {
        this.initailized = true;
        this._cdRef.markForCheck();

        this._initStripe(clientSecret);
      });
  }
}
