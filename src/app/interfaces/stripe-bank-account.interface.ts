/**
 * A US bank account connected through Stripe Financial Connections.
 *
 * `token` is the Stripe payment method id (pm_...) and `mandate` the ACH mandate id the
 * SetupIntent produced. The bank name and last four are for showing the account back to the
 * person who connected it; nothing else about the account reaches the browser.
 */
export interface PaymentMethodStripeBankAccount {
  token: string;
  mandate: string;
  bankName?: string;
  last4?: string;
}
