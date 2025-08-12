import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';


import { MatFormField, MatInput } from '@angular/material/input';

import { loadJs } from '@firestitch/common';


import { FS_PAYMENT_CONFIG } from '../../../../injectors';
import {
  CreditCard, CreditCardConfig, FsPaymentConfig, PaymentMethodCreditCard,
} from '../../../../interfaces';


@Component({
  templateUrl: './helcim-form.component.html',
  styleUrls: ['./helcim-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
  ],

})
export class FsHelcimFormComponent implements OnInit {

  @ViewChild('response') 
  public responseElRef: ElementRef;

  @Input() public config: CreditCardConfig = {};
  @Input() public creditCard: CreditCard = {};

  @Output() public changed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public initailized = false;
  public helcimToken = '1d2a3923f60fa9ec680966';

  constructor(
    @Optional() private _form: NgForm,
    @Inject(FS_PAYMENT_CONFIG) private _paymentConfig: FsPaymentConfig,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    this._initProvider();
  }
  
  public submit() {
    this.openHelcim();
    // const helcim = (window as any).helcimProcess();
    // helcim
    //   .then((x) => {
    //     this.responseElRef.nativeElement.innerHTML = x;
    //   })
    //   .catch((error) => {
    //     debugger;
    //   });
  }

  public openHelcim() {
    (window as any).HelcimPay({
      token: this.helcimToken, // Replace with your token
      transactionType: 'verify',
      amount: 0,
      requireCardholderName: true,
      requireBillingAddress: true,
      requireCVV: true,
      onSuccess: function(response) {
        alert(`Card Token: ${  response.cardToken}`);
      },
      onError: function(error) {
        alert(`Error: ${  error.message}`);
      },
    });
  }

  // public validate = (() => {
  //   return of(null)
  //     .pipe(
  //       switchMap(() => {
  //         if(this.cardEl.classList.contains('StripeElement--empty')) {
  //           return throwError('Card number is required');
  //         }

  //         if(this.cardErrors) {
  //           return throwError(this.cardErrors);
  //         }

  //         return of(null);
  //       }),
  //     );
  // });

  // public ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.creditCardConfig) {
  //     this.config = {
  //       ...
  //       {
  //         name: { readonly: false },
  //         number: { readonly: false },
  //         expiry: { readonly: false },
  //         cvv: { readonly: false },
  //       },
  //       ...changes.creditCardConfig.currentValue,
  //     };
  //   }
  // }

  // public _changed() {
  //   this.changed.emit({ creditCard: this.creditCard });
  // }

  private _initProvider(): void {
    loadJs('https://secure.myhelcim.com/js/version2.js')
      .subscribe(() => {
        this.initailized = true;
        this._cdRef.markForCheck();
      });
  }
}
