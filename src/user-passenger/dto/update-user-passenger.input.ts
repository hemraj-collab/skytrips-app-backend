import { PartialType } from '@nestjs/swagger';
import { CreateUserPassengerInput } from './create-user-passenger.input';

export class UpdateUserPassengerInput extends PartialType(
  CreateUserPassengerInput,
) {}
