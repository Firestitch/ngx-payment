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
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgForm, ValidationErrors, Validator } from '@angular/forms';


import { IFsAddressConfig } from '@firestitch/address';
import { FsFormDirective } from '@firestitch/form';

import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { FS_PAYMENT_CONFIG } from '../../injectors';
import {
  CreditCardConfig,
  PaymentMethodCreditCard,
} from '../../interfaces';
import { StripeService } from '../../services';


@Component({
  selector: 'fs-stripe-credit-card',
  templateUrl: './stripe-credit-card.component.html',
  styleUrls: ['./stripe-credit-card.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  changeDetection: ChangeDetectionStrategy.OnPush,  
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FsStripeCreditCardComponent,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FsStripeCreditCardComponent,
      multi: true,
    },
  ],
})
export class FsStripeCreditCardComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

  @ViewChild('dummyInput', { static: true }) 
  public dummyInput: ElementRef;

  @ViewChild('cardElement', { static: true }) 
  public cardElement: ElementRef;

  @Input() public config: CreditCardConfig = {};
  
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
  @Output() public expressPaymentProcessed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public initailized = false;
  public cardErrors = '';
  public card;
  public paymentMethodCreditCard: PaymentMethodCreditCard = {};

  private _stripe;//: stripe.Stripe;
  private _card;//: stripe.elements.Element;
  private _form = inject(FsFormDirective);
  private _paymentConfig = inject(FS_PAYMENT_CONFIG);
  private _cdRef = inject(ChangeDetectorRef);
  private _onChange: any;
  private _onTouched: any;  
  private _stripeService = inject(StripeService);

  public ngOnInit() {
    this._initProvider();
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    //
  }

  public writeValue(paymentMethodCreditCard: PaymentMethodCreditCard): void {
    this.paymentMethodCreditCard = paymentMethodCreditCard;
  }
  
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    //
  }

  public fieldValidator = () => {
    if(this.validate(null)) {
      throw new Error(Object.values(this.validate(null)).join(', '));
    }
  };

  public validate(control: AbstractControl): ValidationErrors | null {
    if(this.cardEl.classList.contains('StripeElement--empty')) {
      return { required: 'Card number is required' };
    } else if(this.cardEl.classList.contains('StripeElement--invalid')) {
      return { invalid: 'Card number is invalid' };
    } else if(this.cardErrors) {
      return { card: this.cardErrors };
    }

    return null;
  }

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

  public createCard(): Observable<PaymentMethodCreditCard> {
    return from(this._stripe
      .createSource(this._card))
      .pipe(
        map(({ source }) => {
          this.paymentMethodCreditCard = {
            ...this.paymentMethodCreditCard,
            token: source.id,
            creditCard: {
              number: source.card.last4,
              expiryMonth: source.card.exp_month,
              expiryYear: source.card.exp_year,
              type: source.card.brand.toLowerCase(),
              name: source.card.name,
            },
            address: {
              zip: source.owner?.address?.postal_code,
            },
          };

          this._onChange(this.paymentMethodCreditCard);

          return this.paymentMethodCreditCard;
        }),
      );
  }

  private _initStripe(clientSecret): void {
    this._initCreditCard(clientSecret);
  }

  private _initCreditCard(clientSecret): void {
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
      this._form.validate();
    });

    this._card.on('change', (event) => {
      this.cardErrors = event.error?.message;
      this._onTouched();
      this._onChange(this.paymentMethodCreditCard);
      this._form.validate();
      this._cdRef.markForCheck();
    });
    
    this._card.mount(this.cardEl);
  }

  private _initProvider(): void {
    this._stripeService.init()
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
