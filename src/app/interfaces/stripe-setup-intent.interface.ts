/**
 * What a `setupIntents` callback resolves to.
 *
 * `publishableKey` is for apps that only learn the key from their API, alongside the intent,
 * rather than at bootstrap. When it is present it wins over `FS_PAYMENT_CONFIG`, so such an
 * app does not have to provide the config at all.
 */
export interface FsPaymentStripeSetupIntent {
  clientSecret: string;
  publishableKey?: string;
}
