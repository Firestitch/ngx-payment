import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import IMask from 'imask';
import { pick, padStart } from 'lodash-es';

import { IFsAddressConfig } from '@firestitch/address';

import { CreditCardType } from '../../enums/credit-card-type.enum';
import { Address } from '../../interfaces/address.interface';
import { CreditCard } from '../../interfaces/credit-card.interface';


@Component({
  selector: 'fs-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: [ './credit-card.component.scss' ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class FsCreditCardComponent implements OnInit {

  @ViewChild('cardNumberEl')
  public cardNumberEl: ElementRef = null;

  @Input() address: Address = {};
  @Input() creditCard: CreditCard = {};

  @Output() changed: EventEmitter<{ address: Address, creditCard: CreditCard }> = new EventEmitter();

  public cardNumber = '';
  public months = [];
  public years = [];
  public config: IFsAddressConfig = {
    name: { visible: false}
  };

  private _cardNumberImask;

  public ngOnInit() {

    for (let i = 0; i < 12; i++) {
      this.months.push({ name: padStart(String(i + 1), 2, '0'), value: i +  1 });
    }

    const year = new Date().getFullYear();
    for (let i = year; i < (year + 10); i++) {
      this.years.push({ name: i, value: i });
    }

    const maskOptions = {
      mask: '000000000000000000000000000000'
    };
    this._cardNumberImask = IMask(this.cardNumberEl.nativeElement, maskOptions);
    this._cardNumberImask.on('accept', () => {
      this._calculateType(this._cardNumberImask.unmaskedValue);
      this.creditCard.number = this._cardNumberImask.unmaskedValue;
      this._changed();
    });
  }

  public _changed() {
    const picked = ['street', 'city', 'zip', 'country', 'region'];
    const address = pick(this.address, picked);
    this.changed.emit({ address: address, creditCard: this.creditCard});
  }

  private _calculateType(value) {

    const num = String(value);

    if (num.match(/^(34|37)/)) {
      this.creditCard.type = CreditCardType.Amex;

    } else if (num.match(/^4/)) {
      this.creditCard.type = CreditCardType.Visa;

    } else if (num.match(/^(51|52|53|54|55)/)) {
      this.creditCard.type = CreditCardType.Mastercard;

    } else if (num.match(/^(6011|65|64[4-9]|62212[6-9]|6221[3-9][0-9]|622[2-8][0-9]{2}|6229[01][0-9]|62292[0-5])/)) {
      this.creditCard.type = CreditCardType.Discover;

    } else if (num.match(/^(352[89]|35[3-8][0-9])/)) {
      this.creditCard.type = CreditCardType.JBC;

    } else {
      this.creditCard.type = null;
    }

    if (this.creditCard.type === CreditCardType.Amex) {
      this._cardNumberImask.updateOptions( { mask: '0000 000000 00000' });
    } else if ( this.creditCard.type === CreditCardType.Visa ||
                this.creditCard.type === CreditCardType.Mastercard ||
                this.creditCard.type === CreditCardType.Discover ||
                this.creditCard.type === CreditCardType.JBC) {
      this._cardNumberImask.updateOptions( { mask: '0000 0000 0000 0000' });
    } else {
      this._cardNumberImask.updateOptions( { mask: '000000000000000000000000000000' });
    }

    this._cardNumberImask.updateValue();
  }
}
