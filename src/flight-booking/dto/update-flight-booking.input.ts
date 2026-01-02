import { PartialType } from '@nestjs/swagger';
import { CreateFlightBookingInput } from './create-flight-booking.input';

export class UpdateFlightBookingInput extends PartialType(
  CreateFlightBookingInput,
) {}
