import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import IMask from 'imask';

import { IFsAddressConfig } from '@firestitch/address';

import { PaymentMethodBankAccount } from '../../interfaces/bank-account.interface';


@Component({
  selector: 'fs-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: [ './bank-account.component.scss' ],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class FsBankAccountComponent implements AfterViewInit, OnChanges {

  @Input()
  public set bankAccount(value: PaymentMethodBankAccount) {
    this._bankAccount = value;
  }

  @Input()
  public currency: 'USD' | 'CAD' = 'CAD';

  @Input()
  public showAccountType = true;

  @Input()
  public excludeCountries: string[];

  @Input()
  public readonly = false;

  @Input()
  public accountTypes = [
    { name: 'Checking', value: 'CHECKING' },
    { name: 'Savings', value: 'SAVINGS' },
    { name: 'Loan', value: 'LOAN' },
  ]

  @Input()
  public configAddress: IFsAddressConfig = {
    name: { visible: false },
    street: { required: true },
    city: { required: true },
    zip: { required: true },
    region: { required: true },
    country: { required: true }
  };

  @Output() changed: EventEmitter<PaymentMethodBankAccount> = new EventEmitter();

  @ViewChild('branchEl', { static: false })
  public branchEl: ElementRef = null;

  @ViewChild('institutionEl', { static: false })
  public institutionEl: ElementRef = null;

  @ViewChild('accountEl', { static: false })
  public accountEl: ElementRef = null;

  public _bankAccount: PaymentMethodBankAccount = {};
  public years = [];

  public institutionNumberErrorMessage = 'Invalid institution number';

  private _branchImask;
  private _institutionImask;
  private _accountImask;

  public ngAfterViewInit(): void {
    this._setMaskForBranchField();
    this._setMaskForInstitutionField();
    this._setMaskForAccountField();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.currency && changes.currency.previousValue !== changes.currency.currentValue) {
      this._setMaskForBranchField();
      this._setMaskForInstitutionField();
      this._setMaskForAccountField();
    }

    if (changes.readonly) {
      Object.keys(this.configAddress)
        .forEach((key) => {
          this.configAddress[key].disabled = this.readonly;
        });
    }
  }

  public validateBranch = (model) => {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const targetLength = this.currency === 'CAD'
          ? 5
          : 9;
        const length = String(this._bankAccount.branch).length;

        if (length !== targetLength) {
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
        const lessThanMinimum = length < 7;
        const greaterThanMaximum = (this.currency === 'USD' && length > 20)
          || (this.currency === 'CAD' && length > 12);

        if (lessThanMinimum || greaterThanMaximum) {
          return reject('Invalid account number');
        }

        resolve();
      });
    });
  }

  public valueChanged() {
    this.changed.emit(this._bankAccount);
  }

  private _setMaskForBranchField(): void {
    this._destroyMask(this._branchImask);

    if (this.branchEl) {
      const mask = this.currency === 'CAD'
        ? '00000'
        : '000000000';

      this._branchImask = IMask(this.branchEl.nativeElement, { mask: mask });
      this._branchImask.on('accept', () => {
        this._bankAccount.branch = this._branchImask.unmaskedValue;

        this.valueChanged();
      });
    }
  }

  private _setMaskForInstitutionField(): void {
    this._destroyMask(this._institutionImask);

    if (this.institutionEl) {
      this._institutionImask = IMask(this.institutionEl.nativeElement, { mask: '000' });
      this._institutionImask.on('accept', () => {
        this._bankAccount.institution = this._institutionImask.unmaskedValue;
        this.valueChanged();
      });
    }
  }

  private _setMaskForAccountField(): void {
    this._destroyMask(this._accountImask);

    if (this.accountEl) {
      const mask = this.currency === 'CAD'
        ? '000000000000'
        : '00000000000000000000';

      this._accountImask = IMask(this.accountEl.nativeElement, { mask });
      this._accountImask.on('accept', () => {
        this._bankAccount.account = this._accountImask.unmaskedValue;
        this.valueChanged();
      });
    }
  }

  private _destroyMask(target: IMask.InputMask<IMask.AnyMaskedOptions>) {
    if (target) {
      target.destroy();
    }
  }
}
