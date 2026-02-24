import { BadRequestException } from '@nestjs/common';

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class ValidationException extends BadRequestException {
  constructor(details: ValidationErrorDetail[]) {
    super({
      error: 'Validation failed',
      details,
    });
  }
}
