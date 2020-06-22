import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import IMask from 'imask';

import { IFsAddressConfig } from '@firestitch/address';

import { BankAccount } from '../../interfaces/bank-account.interface';


@Component({
  selector: 'fs-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: [ './bank-account.component.scss' ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class FsBankAccountComponent implements OnInit {

  @ViewChild('branchEl', { static: true }) public branchEl: ElementRef = null;
  @ViewChild('institutionEl', { static: true }) public institutionEl: ElementRef = null;
  @ViewChild('accountEl', { static: true }) public accountEl: ElementRef = null;

  @Input('bankAccount') set bankAccount(value: BankAccount) {
    this._bankAccount = value;
  }

  @Output() changed: EventEmitter<BankAccount> = new EventEmitter();

  public _bankAccount: BankAccount = {};
  public months = [];
  public years = [];
  public config: IFsAddressConfig = {
    name: { visible: false}
  };

  public institutionNumberErrorMessage = 'Invalid institution number';

  private _branchImask;
  private _institutionImask;
  private _accountImask;

  public ngOnInit() {

    this._branchImask = IMask(this.branchEl.nativeElement, { mask: '00000' });
    this._branchImask.on('accept', () => {
      this._bankAccount.branch = this._branchImask.unmaskedValue;
      this._changed();
    });

    this._institutionImask = IMask(this.institutionEl.nativeElement, { mask: '000' });
    this._institutionImask.on('accept', () => {
      this._bankAccount.institution = this._institutionImask.unmaskedValue;
      this._changed();
    });

    this._accountImask = IMask(this.accountEl.nativeElement, { mask: '000000000000' });
    this._accountImask.on('accept', () => {
      this._bankAccount.account = this._accountImask.unmaskedValue;
      this._changed();
    });
  }

  public validateBranch = (model) => {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        const length = String(this._bankAccount.branch).length;

        if (length !== 5) {
          return reject('Invalid branch number');
        }

        resolve();
      });
    });
  }

  public validateInstitution = (model) => {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        const length = String(this._bankAccount.institution).length;

        if (length !== 3) {
          return reject('Invalid institution number');
        }

        resolve();
      });
    });
  }

  public validateAccount = (model) => {

    return new Promise((resolve, reject) => {

      setTimeout(() => {
        const length = String(this._bankAccount.account).length;

        if (length < 6 || length > 12) {
          return reject('Invalid account number');
        }

        resolve();
      });
    });
  }

  private _changed() {
    this.changed.emit(this._bankAccount);
  }
}
