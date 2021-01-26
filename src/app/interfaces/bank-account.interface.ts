import { FsAddress } from '@firestitch/address';

export interface BankAccount {
  branch?: number;
  institution?: number;
  account?: number;
  accountType?: 'CHECKING' | 'SAVINGS' | 'LOAN';
  address?: FsAddress;
}
