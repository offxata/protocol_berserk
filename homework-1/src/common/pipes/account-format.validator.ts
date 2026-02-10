import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAccountFormat', async: false })
export class IsAccountFormatConstraint implements ValidatorConstraintInterface {
  validate(account: string, args: ValidationArguments) {
    if (typeof account !== 'string') {
      return false;
    }
    // Pattern: ACC-XXXXX where X is alphanumeric
    const accountPattern = /^ACC-[A-Za-z0-9]{5}$/;
    return accountPattern.test(account);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Account must follow format ACC-XXXXX (where X is alphanumeric)';
  }
}

export function IsAccountFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAccountFormatConstraint,
    });
  };
}
