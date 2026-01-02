import { Module } from '@nestjs/common';
import { FlightBookingController } from './flight-booking.controller';
import { FlightBookingService } from './flight-booking.service';

@Module({
  controllers: [FlightBookingController],
  providers: [FlightBookingService],
  exports: [FlightBookingService],
})
export class FlightBookingModule {}
