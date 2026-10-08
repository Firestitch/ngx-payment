import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { from, Observable, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

import {
  FsPaymentStripeSetupIntent,
  PaymentMethodStripeBankAccount,
} from '../../interfaces';
import { FsPaymentStripe } from '../../services';


/**
 * Connects a US bank account through Stripe Financial Connections and confirms it against a
 * SetupIntent, producing a payment method and an ACH mandate.
 *
 * The person signs in to their bank inside Stripe's modal. Their banking credentials go to the
 * bank and the account and routing numbers go to Stripe; the app receives the payment method
 * id, the mandate id, and the bank name and last four to show back.
 *
 * Connecting is its own step, before whatever the page submits: the modal is interactive and
 * cannot run underneath a submit click without the click appearing to hang. Read
 * `bankAccount()`, or listen to `changed`, when submitting.
 *
 * Only instant verification is accepted. An account Stripe can only verify by micro-deposits
 * takes days to settle, so it is reported as an error rather than left looking connected.
 */
@Component({
  selector: 'fs-stripe-bank-account',
  templateUrl: './stripe-bank-account.component.html',
  styleUrls: ['./stripe-bank-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatProgressSpinner,
  ],
})
export class FsStripeBankAccountComponent implements OnInit {

  /** Falls back to `FS_PAYMENT_CONFIG.stripe.setupIntents`. */
  public setupIntents = input<() => Observable<FsPaymentStripeSetupIntent>>();

  /** The connected account, or null when the person disconnects it. */
  public changed = output<PaymentMethodStripeBankAccount | null>();

  /** Null until an account is connected. */
  public bankAccount = signal<PaymentMethodStripeBankAccount>(null);

  /**
   * Stripe's own wording where it has any. Closing the modal without connecting is not an
   * error and shows nothing: the person backed out deliberately.
   */
  public error = signal<string>('');

  public ready = signal<boolean>(false);
  public connecting = signal<boolean>(false);
  public canConnect = computed<boolean>(() => this.ready() && !this.connecting());

  /** Bank name and last four, for the person to recognize what they connected. */
  public label = computed<string>(() => {
    const bankAccount = this.bankAccount();

    return [bankAccount?.bankName, bankAccount?.last4 ? `••••${bankAccount.last4}` : null]
      .filter(Boolean)
      .join(' ') || 'Bank account connected';
  });

  private _stripeService = inject(FsPaymentStripe);
  private _destroyRef = inject(DestroyRef);
  private _clientSecret: string;

  /** Here rather than in the constructor, because `setupIntents` is not set until then. */
  public ngOnInit(): void {
    this._loadSetupIntent();
  }

  public connect(): void {
    if (!this.canConnect()) {
      return;
    }

    this.error.set('');
    this.connecting.set(true);

    this._collect()
      .pipe(
        switchMap((collectedSetupIntent) => collectedSetupIntent
          ? this._confirm(collectedSetupIntent)
          : of(null)),
        finalize(() => this.connecting.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: (bankAccount: PaymentMethodStripeBankAccount) => {
          if (bankAccount) {
            this.bankAccount.set(bankAccount);
            this.changed.emit(bankAccount);
          }
        },
        error: () => this.error.set('We could not reach your bank. Please try again.'),
      });
  }

  /**
   * Lets the person pick a different account. A succeeded SetupIntent cannot collect another
   * account, so a fresh one is fetched.
   */
  public disconnect(): void {
    this.bankAccount.set(null);
    this.error.set('');
    this.changed.emit(null);
    this._loadSetupIntent();
  }

  private _loadSetupIntent(): void {
    this.ready.set(false);

    this._stripeService.initSetupIntent(this.setupIntents())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: ({ clientSecret }) => {
          this._clientSecret = clientSecret;
          this.ready.set(true);
        },
        error: () => this.error.set('Bank connection is unavailable right now. Please try again later.'),
      });
  }

  /**
   * Opens the institution picker and returns the collected SetupIntent, or null.
   *
   * The intent is returned because this is the only step where Stripe expands the payment
   * method, with the bank name and last four. After confirmation it is a bare id.
   */
  private _collect(): Observable<any> {
    return from(this._stripeService.stripe.collectBankAccountForSetup({
      clientSecret: this._clientSecret,
      params: {
        payment_method_type: 'us_bank_account',
      },
    }))
      .pipe(
        map(({ error, setupIntent }: any) => {
          if (error) {
            this.error.set(error.message);

            return null;
          }

          // Closing the modal leaves the intent still waiting for a payment method.
          return setupIntent?.status === 'requires_payment_method' ? null : setupIntent;
        }),
      );
  }

  /**
   * Confirms the collected account. Anything short of `succeeded` (`requires_action` means
   * micro-deposits) is refused rather than left looking connected.
   */
  private _confirm(collectedSetupIntent: any): Observable<PaymentMethodStripeBankAccount> {
    return from(this._stripeService.stripe.confirmUsBankAccountSetup(this._clientSecret))
      .pipe(
        map(({ error, setupIntent }: any) => {
          if (error) {
            this.error.set(error.message);

            return null;
          }

          if (setupIntent?.status !== 'succeeded') {
            this.error.set('That account could not be verified instantly. Please try a different account.');

            return null;
          }

          const usBankAccount = collectedSetupIntent?.payment_method?.us_bank_account;

          return {
            token: this._getId(setupIntent.payment_method),
            mandate: this._getId(setupIntent.mandate),
            bankName: usBankAccount?.bank_name,
            last4: usBankAccount?.last4,
          };
        }),
      );
  }

  /** Stripe returns these as a bare id or an expanded object depending on the call. */
  private _getId(value: any): string {
    return typeof value === 'string' ? value : value?.id ?? null;
  }
}
