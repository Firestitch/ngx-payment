import {
  ApplicationRef,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgForm, ValidationErrors, Validator } from '@angular/forms';

import { DomPortalOutlet } from '@angular/cdk/portal';

import { loadJs } from '@firestitch/common';
import { FsFormDirective } from '@firestitch/form';

import { from, Observable, of, switchMap, throwError } from 'rxjs';

import { FS_PAYMENT_CONFIG } from '../../injectors';
import {
  PaymentMethodCreditCard,
} from '../../interfaces';


@Component({
  selector: 'fs-credit-card-square',
  templateUrl: './credit-card-square.component.html',
  styleUrls: ['./credit-card-square.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FsCreditCardSquareComponent,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FsCreditCardSquareComponent,
      multi: true,
    },
  ],
})
export class FsCreditCardSquareComponent 
implements OnInit, OnDestroy, Validator, ControlValueAccessor  {

  @ViewChild('cardContainer') 
  public cardContainer: ElementRef;

  @Output() public changed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public initailized = false;
  public cardErrors: any = {};
  public cardNumber;
  public card;

  private _portalOutlet: DomPortalOutlet | null = null;
  private _paymentConfig = inject(FS_PAYMENT_CONFIG);
  private _cdRef = inject(ChangeDetectorRef);
  private _injector = inject(Injector);
  private _applicationRef = inject(ApplicationRef);
  private _environmentInjector = inject(EnvironmentInjector);
  private _componentFactoryResolver = inject(ComponentFactoryResolver);
  private _form = inject(FsFormDirective);
  private _onChange: any;
  private _onTouched: any;  

  public ngOnInit() {
    this._initProvider();
    // this._portalOutlet = new DomPortalOutlet(
    //   document.body,
    //   this._componentFactoryResolver,
    //   this._applicationRef,
    //   this._environmentInjector,
    // );

    // const portal = new ComponentPortal(FsHelcimFormComponent);
    // const componentRef = this._portalOutlet.attach(portal); // Attach to DomPortalOutlet
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
    this._form.dirty();
  }

  public setDisabledState?(isDisabled: boolean): void {
    //
  }

  public writeValue(obj: any): void {
    //
  }
  
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    //
  }

  public ngOnDestroy(): void {
    if (this._portalOutlet && this._portalOutlet.hasAttached()) {
      this._portalOutlet.detach();
      this._portalOutlet.dispose();
      this._portalOutlet = null;
    }
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    const hasError = Object.values(this.cardErrors).some((error) => error);
    if(hasError) {
      return { invalid: true };
    }

    return null;
  }

  public createToken(): Observable<PaymentMethodCreditCard> {
    return from(this.card.tokenize())
      .pipe(
        switchMap((result: any) => {
          if (result.status === 'OK') {
            const paymentMethodCreditCard: PaymentMethodCreditCard = {
              token: result.token,
              creditCard: {
                number: result.details.card.last4,
                expiryMonth: result.details.card.expMonth,
                expiryYear: result.details.card.expYear,
              },
              address: {
                zip: result.details.billing.postalCode,
              },
            };

            return of(paymentMethodCreditCard);
          }
          
          let errorMessage = `Tokenization failed with status: ${result.status}`;
          if (result.errors) {
            errorMessage += ` and errors: ${JSON.stringify(result.errors)}`;
          }

          return throwError(() => new Error(errorMessage));
        }),
      );

  }
  
  private _initProvider(): void {
    const url = this._paymentConfig.production ? 
      'https://web.squarecdn.com/v1/square.js' : 
      'https://sandbox.web.squarecdn.com/v1/square.js';

    loadJs(url)
      .pipe(
        switchMap(() => {
          const payments = (window as any).Square
            .payments(
              this._paymentConfig.square?.applicationId, 
              this._paymentConfig.square?.locationId,
            );

          return from(payments.card({
            style: this.style,
          }));
        }),
      )
      .subscribe((card) => {
        this.card = card;
        (card as any).attach('#card-container');

        // Validation state changes
        this.card.addEventListener('errorClassAdded', (event) => {
          this.cardErrors[event.detail.field] = true;
          this._onTouched(null);
          
        });

        this.card.addEventListener('errorClassRemoved', (event) => {
          this.cardErrors[event.detail.field] = false;
          this._onTouched(null);
        });

        this._cdRef.markForCheck();
      });
  }

  public get style() {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--mdc-outlined-text-field-focus-outline-color')
      .trim();

    const placeholderColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--mdc-outlined-text-field-label-text-color')
      .trim();

    const errorColor = '#f44336';

    return {
      '.input-container': {
        borderColor: '#9E9E9E',
        borderRadius: '4px',
      },
      '.input-container.is-focus': {
        borderColor: primaryColor,
      },
      '.input-container.is-error': {
        borderColor: errorColor,
      },
      '.message-text': {
        color: '#999999',
      },
      '.message-icon': {
        color: '#999999',
      },
      '.message-text.is-error': {
        color: errorColor,
      },
      '.message-icon.is-error': {
        color: errorColor,
      },
      input: {
        fontSize: '15px',
      },
      'input::placeholder': {
        color: placeholderColor,
      },
      'input.is-error': {
        color: errorColor,
      },    
    };
  }
}
