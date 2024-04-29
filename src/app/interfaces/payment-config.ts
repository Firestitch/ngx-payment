import { Observable } from "rxjs";

export interface FsPaymentConfig {
  stripe?: {
    publishableKey: string,
    setupIntents?: () => Observable<{ clientSecret: string }>,
  };
}
