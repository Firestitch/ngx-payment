import { FsAddress } from '@firestitch/address';

export interface PaymentMethodBankAccount {
  branch?: string;
  institution?: string;
  account?: string;
  accountType?: 'CHECKING' | 'SAVINGS' | 'LOAN';
  address?: FsAddress;
}
