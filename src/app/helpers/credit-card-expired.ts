export function isCreditCardExpired(expiry: string): boolean {
  const month = parseInt(expiry.substring(0, 2), 10);
  const year = parseInt(expiry.substring(2, 4), 10);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return true;
  }

  return false;
}
