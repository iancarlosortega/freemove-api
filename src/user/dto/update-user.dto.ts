import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dtos/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // TODO: add fields to update
}
