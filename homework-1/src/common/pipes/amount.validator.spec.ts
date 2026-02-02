import { IsValidAmountConstraint } from './amount.validator';

describe('IsValidAmountConstraint', () => {
  let validator: IsValidAmountConstraint;

  beforeEach(() => {
    validator = new IsValidAmountConstraint();
  });

  describe('validate', () => {
    it('should return true for valid amounts', () => {
      expect(validator.validate(100, {} as any)).toBe(true);
      expect(validator.validate(100.5, {} as any)).toBe(true);
      expect(validator.validate(100.50, {} as any)).toBe(true);
      expect(validator.validate(0.01, {} as any)).toBe(true);
      expect(validator.validate(999999.99, {} as any)).toBe(true);
    });

    it('should return false for invalid amounts', () => {
      expect(validator.validate(0, {} as any)).toBe(false); // Zero
      expect(validator.validate(-100, {} as any)).toBe(false); // Negative
      expect(validator.validate(100.555, {} as any)).toBe(false); // More than 2 decimals
      expect(validator.validate(100.123, {} as any)).toBe(false); // More than 2 decimals
    });

    it('should return false for non-number values', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
      expect(validator.validate('100' as any, {} as any)).toBe(false);
      expect(validator.validate(NaN as any, {} as any)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return appropriate error message', () => {
      const message = validator.defaultMessage({} as any);
      expect(message).toContain('positive');
      expect(message).toContain('decimal');
    });
  });
});
