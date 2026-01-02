import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase';
import { AuthModule } from './auth/auth.module';
import { UserPassengerController } from './user-passenger/user-passenger.controller';
import { UserPassengerModule } from './user-passenger/user-passenger.module';
import { FlightBookingModule } from './flight-booking/flight-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    UserPassengerModule,
    FlightBookingModule,
  ],
  controllers: [AppController, UserPassengerController],
  providers: [AppService],
})
export class AppModule {}
