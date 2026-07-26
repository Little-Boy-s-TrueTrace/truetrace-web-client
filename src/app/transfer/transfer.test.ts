// Client-side transfer page validation rules test spec

function validateTransferForm(
  sourceAccount: string,
  targetAccount: string,
  amount: string,
  description: string
): { error: string | null; parsedAmount?: number; cleanDescription?: string } {
  const targetTrimmed = targetAccount.trim();
  const sourceTrimmed = sourceAccount.trim();

  // 1. Account format validation
  const accRegex = /^ACC-\d{6}$/;
  if (!accRegex.test(targetTrimmed)) {
    return { error: 'Recipient account number must be in ACC-XXXXXX format (e.g., ACC-123456).' };
  }

  if (sourceTrimmed === targetTrimmed) {
    return { error: 'Source and recipient account numbers must be different.' };
  }

  // 2. Positive amount validation
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return { error: 'Transfer amount must be a valid positive number greater than zero.' };
  }

  // 3. HTML sanitization for XSS prevention
  const cleanDescription = description
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();

  if (!cleanDescription) {
    return { error: 'Description cannot be empty or contain only HTML tags.' };
  }

  return { error: null, parsedAmount, cleanDescription };
}

describe('Next.js Web Client Transfer Form Validation & Sanitization Tests', () => {
  
  test('should fail if recipient account format is incorrect', () => {
    const result = validateTransferForm('ACC-111111', 'INVALID-ACC', '500.0', 'Payment');
    expect(result.error).toBe('Recipient account number must be in ACC-XXXXXX format (e.g., ACC-123456).');
  });

  test('should fail if source and recipient accounts are identical', () => {
    const result = validateTransferForm('ACC-111111', 'ACC-111111', '500.0', 'Payment');
    expect(result.error).toBe('Source and recipient account numbers must be different.');
  });

  test('should fail if amount is negative or zero', () => {
    const result1 = validateTransferForm('ACC-111111', 'ACC-222222', '-50.0', 'Payment');
    expect(result1.error).toBe('Transfer amount must be a valid positive number greater than zero.');

    const result2 = validateTransferForm('ACC-111111', 'ACC-222222', '0', 'Payment');
    expect(result2.error).toBe('Transfer amount must be a valid positive number greater than zero.');

    const result3 = validateTransferForm('ACC-111111', 'ACC-222222', 'abc', 'Payment');
    expect(result3.error).toBe('Transfer amount must be a valid positive number greater than zero.');
  });

  test('should strip HTML tags and script elements from description to prevent Stored XSS', () => {
    const result = validateTransferForm(
      'ACC-111111',
      'ACC-222222',
      '500.0',
      '<script>alert("XSS")</script>Secure payment'
    );
    expect(result.error).toBeNull();
    expect(result.cleanDescription).toBe('Secure payment');
  });

  test('should fail if description contains only script or HTML tags', () => {
    const result = validateTransferForm(
      'ACC-111111',
      'ACC-222222',
      '500.0',
      '<script>alert("XSS")</script><div></div>'
    );
    expect(result.error).toBe('Description cannot be empty or contain only HTML tags.');
  });

  test('should succeed if all inputs are valid', () => {
    const result = validateTransferForm('ACC-111111', 'ACC-222222', '1250.75', 'Valid transfer message');
    expect(result.error).toBeNull();
    expect(result.parsedAmount).toBe(1250.75);
    expect(result.cleanDescription).toBe('Valid transfer message');
  });
});
