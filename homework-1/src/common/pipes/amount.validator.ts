import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidAmount', async: false })
export class IsValidAmountConstraint implements ValidatorConstraintInterface {
  validate(amount: number, args: ValidationArguments) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return false;
    }
    // Must be positive
    if (amount <= 0) {
      return false;
    }
    // Check decimal places (max 2)
    const decimalPlaces = (amount.toString().split('.')[1] || '').length;
    return decimalPlaces <= 2;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Amount must be a positive number with maximum 2 decimal places';
  }
}

export function IsValidAmount(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidAmountConstraint,
    });
  };
}
