import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} does not exist`);
  }
}
