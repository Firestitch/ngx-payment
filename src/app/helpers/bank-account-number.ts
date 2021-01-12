export function bankAccountNumber(bankAccountNumber: string | number, showAsterisk = true) {
  bankAccountNumber = bankAccountNumber.toString();

  if (!bankAccountNumber) {
    return '';
  }

  if (bankAccountNumber.length < 4) {
    bankAccountNumber = bankAccountNumber.padStart(4, '0');
  } else if (bankAccountNumber.length > 4) {
    bankAccountNumber = bankAccountNumber.slice(-4);
  }

  return `${showAsterisk ? '**** ' : ''}${bankAccountNumber}`;
}
