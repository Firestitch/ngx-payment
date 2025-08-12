import { InjectionToken } from '@angular/core';

import { FsPaymentConfig } from '../interfaces';

export const FS_PAYMENT_CONFIG = new InjectionToken<FsPaymentConfig>('fsPayment.config');
