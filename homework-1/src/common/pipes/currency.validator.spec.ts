import { IsValidCurrencyConstraint } from './currency.validator';

describe('IsValidCurrencyConstraint', () => {
  let validator: IsValidCurrencyConstraint;

  beforeEach(() => {
    validator = new IsValidCurrencyConstraint();
  });

  describe('validate', () => {
    it('should return true for valid currency codes', () => {
      expect(validator.validate('USD', {} as any)).toBe(true);
      expect(validator.validate('EUR', {} as any)).toBe(true);
      expect(validator.validate('GBP', {} as any)).toBe(true);
      expect(validator.validate('JPY', {} as any)).toBe(true);
      expect(validator.validate('CAD', {} as any)).toBe(true);
      expect(validator.validate('AUD', {} as any)).toBe(true);
    });

    it('should return false for invalid currency codes', () => {
      expect(validator.validate('XYZ', {} as any)).toBe(false);
      expect(validator.validate('US', {} as any)).toBe(false); // Too short
      expect(validator.validate('USDD', {} as any)).toBe(false); // Too long
      expect(validator.validate('123', {} as any)).toBe(false);
    });

    it('should accept case-insensitive currency codes', () => {
      expect(validator.validate('usd', {} as any)).toBe(true); // Lowercase converted to uppercase
      expect(validator.validate('UsD', {} as any)).toBe(true); // Mixed case converted to uppercase
      expect(validator.validate('eur', {} as any)).toBe(true); // Lowercase converted to uppercase
    });

    it('should return false for non-string values', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
      expect(validator.validate(123 as any, {} as any)).toBe(false);
      expect(validator.validate({} as any, {} as any)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return appropriate error message', () => {
      const message = validator.defaultMessage({} as any);
      expect(message).toContain('ISO 4217');
      expect(message).toContain('USD');
    });
  });
});
