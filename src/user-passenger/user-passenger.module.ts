import { Module } from '@nestjs/common';
import { UserPassengerService } from './user-passenger.service';
import { UserPassengerController } from './user-passenger.controller';

@Module({
  controllers: [UserPassengerController],
  providers: [UserPassengerService],
  exports: [UserPassengerService],
})
export class UserPassengerModule {}
