import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Common ISO 4217 currency codes
const VALID_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD',
  'SEK', 'NOK', 'DKK', 'PLN', 'RUB', 'INR', 'BRL', 'ZAR', 'KRW', 'MXN',
  'NZD', 'TRY', 'THB', 'IDR', 'MYR', 'PHP', 'CZK', 'HUF', 'ILS', 'CLP',
];

@ValidatorConstraint({ name: 'isValidCurrency', async: false })
export class IsValidCurrencyConstraint implements ValidatorConstraintInterface {
  validate(currency: string, args: ValidationArguments) {
    if (typeof currency !== 'string') {
      return false;
    }
    return VALID_CURRENCIES.includes(currency.toUpperCase());
  }

  defaultMessage(args: ValidationArguments) {
    return 'Currency must be a valid ISO 4217 code (e.g., USD, EUR, GBP)';
  }
}

export function IsValidCurrency(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCurrencyConstraint,
    });
  };
}
