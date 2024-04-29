import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { switchMap } from 'rxjs/operators';

import { IFsAddressConfig } from '@firestitch/address';

import { loadJs } from '@firestitch/common';
import { from, Observable, of, throwError } from 'rxjs';
import { FS_PAYMENT_CONFIG } from '../../injectors';
import { CreditCard, CreditCardConfig, FsPaymentConfig, PaymentMethodCreditCard } from '../../interfaces';

declare let Stripe; // : stripe.StripeStatic;


@Component({
  selector: 'fs-credit-card-stripe',
  templateUrl: './credit-card-stripe.component.html',
  styleUrls: [ './credit-card-stripe.component.scss' ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class FsCreditCardStripeComponent implements OnInit, OnChanges {

  @ViewChild('dummyInput', { static: true }) 
  public dummyInput: ElementRef;

  @ViewChild('cardElement', { static: true }) 
  public cardElement: ElementRef;

  @Input() public config: CreditCardConfig = {};
  @Input() public creditCard: CreditCard = {};

  @Output() changed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public initailized = false;
  public cardErrors = '';
  public card;

  private _stripe;//: stripe.Stripe;
  private _card;//: stripe.elements.Element;

  @Input()
  public addressConfig: IFsAddressConfig = {
    name: { visible: false },
    street: { required: true },
    city: { required: true },
    region: { required: true },
    zip: { required: true },
    country: { required: true },
  };

  public constructor(
    @Optional() private form: NgForm,
    @Inject(FS_PAYMENT_CONFIG) private _paymentConfig: FsPaymentConfig,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this._initProvider();
  }

  public validate = ((formControl) => {
    return of(null)
      .pipe(
        switchMap(() => {
          if(this.cardErrors) {
            return throwError(this.cardErrors);
          }

          return of(null);
        }),
      );
  })

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
    this.changed.emit({ creditCard: this.creditCard});
  }

  public createToken(): Observable<any> {
    return from(this._stripe.createToken(this._card));
  }

  private _initStripe(clientSecret): void {
    const inputStyle = getComputedStyle(this.dummyInput.nativeElement);
    const fontFamily = inputStyle.fontFamily.replace(/"/g,'');
    this._stripe = Stripe(this._paymentConfig.stripe?.publishableKey);

    const cssUrl = new URL('https://fonts.googleapis.com/css');
    cssUrl.searchParams.append('family', fontFamily + ':400,500');

    const elements = this._stripe.elements({ 
      clientSecret: clientSecret,
      fonts: [
        {
          cssSrc: cssUrl.toString()
        }
      ]
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

    this._card.on('blur', (event) => {
      let message = '';
      if(this.cardEl.classList.contains('StripeElement--empty')) {
        message = 'Card number is required';
      } else if(this.cardEl.classList.contains('StripeElement--invalid')) {
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

  public updateAndValidate(message) {
    this.cardErrors = message;
    this.form.controls['cardInput'].markAsDirty();
    this.form.controls['cardInput'].updateValueAndValidity();
  }

  private _initProvider(): void {
    loadJs('https://js.stripe.com/v3/')
    .pipe(
      switchMap(() => {
        return this._paymentConfig.stripe.setupIntents()
      })        
    )
    .subscribe(({ clientSecret }) => {
      this.initailized = true;
      this._cdRef.markForCheck();

      this._initStripe(clientSecret);
    });
  }
}
