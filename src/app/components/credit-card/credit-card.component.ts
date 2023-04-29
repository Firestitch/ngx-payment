import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import IMask from 'imask';
import { pick, padStart } from 'lodash-es';

import { FsAddress, IFsAddressConfig } from '@firestitch/address';

import { CreditCardType } from '../../enums/credit-card-type.enum';
import { CreditCard, CreditCardConfig, PaymentMethodCreditCard } from '../../interfaces/credit-card.interface';
import { CARD_TYPE_IMAGES } from '../../consts/card-type-images.const';


@Component({
  selector: 'fs-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: [ './credit-card.component.scss' ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCreditCardComponent implements OnInit, OnChanges {

  @ViewChild('cardNumberEl', { static: true })
  public cardNumberEl: ElementRef = null;

  @Input() address: FsAddress = {};
  @Input() showAddress = true;
  @Input() creditCardConfig: CreditCardConfig = {};

  @Input() creditCard: CreditCard = {};

  @Input()
  public excludeCountries: string[];

  @Input()
  public readonly = false;

  @Output() changed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public cardImages: Partial<Record<CreditCardType, string>> = CARD_TYPE_IMAGES;
  public cardNumber = '';
  public months = [];
  public years = [];
  public verificationCode = 'CVV/CVC';

  @Input()
  public addressConfig: IFsAddressConfig = {
    name: { visible: false },
    street: { required: true },
    city: { required: true },
    region: { required: true },
    zip: { required: true },
    country: { required: true },
  };

  private _cardNumberImask;

  public constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit() {
    for (let i = 0; i < 12; i++) {
      this.months.push({ name: padStart(String(i + 1), 2, '0'), value: (i +  1).toString() });
    }

    this.creditCardConfig = {
      name: {},
      number: {},
      expiry: {},
      cvv: {},
      ...this.creditCardConfig,
    }

    this.creditCard.expiryMonth = parseInt(this.creditCard.expiryMonth || '').toString();
    this.creditCard.expiryYear = (this.creditCard.expiryYear || '').toString();

    const year = new Date().getFullYear();
    for (let i = year; i < (year + 10); i++) {
      this.years.push({ name: i, value: i.toString() });
    }

    const maskOptions = {
      mask: '000000000000000000000000000000'
    };

    this._cardNumberImask = IMask(this.cardNumberEl.nativeElement, maskOptions);
    this._cardNumberImask.on('accept', () => {
      this._calculateType(this._cardNumberImask.unmaskedValue);
      this.creditCard.number = this._cardNumberImask.unmaskedValue;
      this._changed();
      this._cdRef.markForCheck();
    });

    this._calculateType(this.creditCard?.number);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.creditCardConfig) {
      this.creditCardConfig = {
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

    if (changes.readonly) {
      Object.keys(this.addressConfig)
        .forEach((key) => {
          this.addressConfig[key].disabled = this.readonly;
        });
      this.creditCardConfig.name.readonly = changes.readonly.currentValue;
      this.creditCardConfig.number.readonly = changes.readonly.currentValue;
      this.creditCardConfig.expiry.readonly = changes.readonly.currentValue;
      this.creditCardConfig.cvv.readonly = changes.readonly.currentValue;
    }

    if (changes.creditCard) {
      this.cardNumber = this.creditCard.number;
    }
  }

  public _changed() {
    const picked = ['street', 'city', 'zip', 'country', 'region'];
    const address = pick(this.address, picked);
    this.changed.emit({ address: address, creditCard: this.creditCard});
  }

  public validateCVV = (model) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const length = String(this.creditCard.cvv).length;
        const CVVNumberOfDigits = this.creditCard.type === CreditCardType.Amex
          ? 4
          : 3;

        if (length !== CVVNumberOfDigits) {
          return reject(`Invalid ${this.verificationCode} number`);
        }

        resolve(true);
      });
    });
  }

  private _calculateType(value) {
    const num = String(value);

    if (num.match(/^(34|37)/)) {
      this.creditCard.type = CreditCardType.Amex;
      this.verificationCode = 'CID';

    } else if (num.match(/^4/)) {
      this.creditCard.type = CreditCardType.Visa;
      this.verificationCode = 'CVV';

    } else if (
      num.match(/^(5018|5020|5036|5038|5893|5573|6277|6304|6759|6761|6762|6763)[0-9]{8,15}$/) || 
      num.match(/^5[1-5][0-9]{14}$/)
    ) {
      this.creditCard.type = CreditCardType.Mastercard;
      this.verificationCode = 'CVC';

    } else if (num.match(/^(6011|65|64[4-9]|62212[6-9]|6221[3-9][0-9]|622[2-8][0-9]{2}|6229[01][0-9]|62292[0-5])/)) {
      this.creditCard.type = CreditCardType.Discover;
      this.verificationCode = 'CID';

    } else if (num.match(/^(352[89]|35[3-8][0-9])/)) {
      this.creditCard.type = CreditCardType.JBC;
      this.verificationCode = 'CAV';

    } else {
      this.creditCard.type = null;
      this.verificationCode = 'CVV/CVC';
    }

    if (this.creditCard.type === CreditCardType.Amex) {
      this._cardNumberImask.updateOptions( { mask: '0000 000000 00000' });
    } else if ( 
      this.creditCard.type === CreditCardType.Visa ||
      this.creditCard.type === CreditCardType.Mastercard ||
      this.creditCard.type === CreditCardType.Discover ||
      this.creditCard.type === CreditCardType.JBC) {
      this._cardNumberImask.updateOptions( { mask: '0000 0000 0000 0000' });
    } else {
      this._cardNumberImask.updateOptions( { mask: '000000000000000000000000000000' });
    }

    this._cardNumberImask.updateValue();
    this._cdRef.markForCheck();
  }
}
