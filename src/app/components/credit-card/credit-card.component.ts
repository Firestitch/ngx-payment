import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import IMask from 'imask';

import { IFsAddressConfig } from '@firestitch/address';

import { CardType } from 'src/app/enums/card-type.enum';


@Component({
  selector: 'fs-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: [ './credit-card.component.scss' ],
})
export class FsCreditCardComponent implements OnInit {

  @ViewChild('cardNumberEl')
  public cardNumberEl: ElementRef = null;

  public card: any = {};
  public logoClass = '';
  public cardNumber = '';
  public months = [];
  public years = [];
  public config: IFsAddressConfig = { map: false, search: false, name: { visible: false} };
  public address = {};

  private _cardNumberImask;


  public searchChanged($event) { }

  public cardNumberChange(value) {
    this._calculateLogoClass(value);
  }

  public ngOnInit() {

    for (let i = 0; i < 12; i++) {
      // padStart is defined in the ES2017 standard. Compiler throw an error
      this.months.push({ name: String(i + 1)['padStart'](2, '0'), value: i });
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
      this._calculateLogoClass(this._cardNumberImask.unmaskedValue);
      this.card.number = this._cardNumberImask.unmaskedValue;
    });
  }

  private _calculateLogoClass(value) {

    const num = String(value);
    let logoClass = '';

    if (num.match(/^(34|37)/)) {
      logoClass = CardType.Amex;

    } else if (num.match(/^4/)) {
      logoClass = CardType.Visa;

    } else if (num.match(/^(51|52|53|54|55)/)) {
      logoClass = CardType.Mastercard;

    } else {
      logoClass = '';
    }

    this.logoClass = logoClass;

    if (this.logoClass === CardType.Amex) {
      this._cardNumberImask.updateOptions( { mask: '0000 000000 00000' });
    } else if (this.logoClass === CardType.Visa || this.logoClass === CardType.Mastercard) {
      this._cardNumberImask.updateOptions( { mask: '0000 0000 0000 0000' });
    } else {
      this._cardNumberImask.updateOptions( { mask: '000000000000000000000000000000' });
    }

    this._cardNumberImask.updateValue();

  }

}
