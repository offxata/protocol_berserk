import { IsAccountFormatConstraint } from './account-format.validator';

describe('IsAccountFormatConstraint', () => {
  let validator: IsAccountFormatConstraint;

  beforeEach(() => {
    validator = new IsAccountFormatConstraint();
  });

  describe('validate', () => {
    it('should return true for valid account format', () => {
      expect(validator.validate('ACC-12345', {} as any)).toBe(true);
      expect(validator.validate('ACC-ABC12', {} as any)).toBe(true);
      expect(validator.validate('ACC-1a2B3', {} as any)).toBe(true);
      expect(validator.validate('ACC-ABCDE', {} as any)).toBe(true);
    });

    it('should return false for invalid account format', () => {
      expect(validator.validate('ACC-1234', {} as any)).toBe(false); // Too short
      expect(validator.validate('ACC-123456', {} as any)).toBe(false); // Too long
      expect(validator.validate('acc-12345', {} as any)).toBe(false); // Lowercase prefix
      expect(validator.validate('ACC12345', {} as any)).toBe(false); // Missing dash
      expect(validator.validate('ABC-12345', {} as any)).toBe(false); // Wrong prefix
      expect(validator.validate('ACC-12-34', {} as any)).toBe(false); // Extra dash
      expect(validator.validate('', {} as any)).toBe(false); // Empty string
    });

    it('should return false for non-string values', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
      expect(validator.validate(12345 as any, {} as any)).toBe(false);
      expect(validator.validate({} as any, {} as any)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return appropriate error message', () => {
      const message = validator.defaultMessage({} as any);
      expect(message).toContain('ACC-XXXXX');
      expect(message).toContain('alphanumeric');
    });
  });
});
