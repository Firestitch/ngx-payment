import { Observable } from 'rxjs';

import { FsPaymentStripeSetupIntent } from './stripe-setup-intent.interface';

export interface FsPaymentConfig {
  stripe?: {
    publishableKey: string,
    setupIntents?: () => Observable<FsPaymentStripeSetupIntent>,
  };
  square?: {
    applicationId: string,
    locationId: string,
  };
  production?: boolean;
}
