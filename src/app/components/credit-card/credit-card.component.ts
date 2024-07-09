import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import IMask from 'imask';
import { pick } from 'lodash-es';

import { FsAddress, IFsAddressConfig } from '@firestitch/address';

import { FsMaskDirective } from '@firestitch/mask';
import { CARD_TYPE_IMAGES } from '../../consts/card-type-images.const';
import { CreditCardType } from '../../enums/credit-card-type.enum';
import { isCreditCardExpired } from '../../helpers/credit-card-expired';
import { CreditCard, CreditCardConfig, PaymentMethodCreditCard } from '../../interfaces/credit-card.interface';


@Component({
  selector: 'fs-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: [ './credit-card.component.scss' ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsCreditCardComponent implements OnInit, OnChanges {

  @ViewChild('cardNumberEl', { static: true })
  public cardNumberEl: ElementRef;

  @ViewChild('cardExpiryEl', { read: FsMaskDirective })
  public cardExpiryEl: FsMaskDirective;

  @Input() public address: FsAddress = {};
  @Input() public creditCardConfig: CreditCardConfig = {};

  @Input() public creditCard: CreditCard = {};

  @Input()
  public excludeCountries: string[];

  @Input()
  public readonly = false;

  @Input()
  public allowExpired = false;

  @Output() changed: EventEmitter<PaymentMethodCreditCard> = new EventEmitter();

  public cardImages: Partial<Record<CreditCardType, string>> = CARD_TYPE_IMAGES;
  public cardNumber = '';
  public expiry = '';
  public verificationCode = 'CVV/CVC';
  public creditCardMask = '';
  public expiryBlocks = {
    MM: {        
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
      placeholderChar: 'M'
    },
    YY: {
      mask: '00',
      placeholderChar: 'Y'
    },
  };

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
    this.creditCardConfig = {
      name: {},
      number: {},
      expiry: {},
      cvv: {},
      ...this.creditCardConfig,
    }

    this.creditCard.expiryMonth = parseInt(this.creditCard.expiryMonth || '').toString();
    this.creditCard.expiryYear = (this.creditCard.expiryYear || '').toString();

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

    if(this.creditCard?.expiryMonth && this.creditCard?.expiryYear) {
      this.expiry = (
        String((this.creditCard?.expiryMonth || '').padStart(2, '0')) + 
        String(this.creditCard?.expiryYear || '').substring(2, 4)
      );
    }
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

  public expiryValidate = (model) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (model.value.length !== 4) {
          return reject(`Invalid expiry date`);
        }

        if (!this.allowExpired && isCreditCardExpired(model.value)) {
          return reject(`Invalid expiry date`);
        }

        resolve(true);
      });
    });
  }

  public expiryChange(value): void{
    this.creditCard.expiryMonth = String(Number(value.substr(0, 2)));
    this.creditCard.expiryYear = String(Number(value.substr(2, 4)) + 2000);
    this._changed();
  }

  public expiryFocus(): void {
    this.cardExpiryEl.imask.updateOptions({ lazy: false });
  }

  public expiryBlur(): void {    
    this.cardExpiryEl.imask.updateOptions({ lazy: true });
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
