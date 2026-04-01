import { FsBankAccountComponent } from './bank-account.component';

describe('FsBankAccountComponent', () => {
  describe('validateBranch', () => {
    it('rejects CAD with Invalid branch number when length is not 5', async () => {
      const c = new FsBankAccountComponent();
      c.currency = 'CAD';
      c._bankAccount = { branch: '1234' };
      await expectAsync(c.validateBranch(null)).toBeRejectedWith('Invalid branch number');
    });

    it('resolves CAD when branch is 5 digits', async () => {
      const c = new FsBankAccountComponent();
      c.currency = 'CAD';
      c._bankAccount = { branch: '12345' };
      await expectAsync(c.validateBranch(null)).toBeResolved();
    });

    it('rejects USD with Invalid routing number when length is not 9', async () => {
      const c = new FsBankAccountComponent();
      c.currency = 'USD';
      c._bankAccount = { branch: '12345678' };
      await expectAsync(c.validateBranch(null)).toBeRejectedWith('Invalid routing number');
    });

    it('resolves USD when branch is 9 digits', async () => {
      const c = new FsBankAccountComponent();
      c.currency = 'USD';
      c._bankAccount = { branch: '123456789' };
      await expectAsync(c.validateBranch(null)).toBeResolved();
    });
  });
});
