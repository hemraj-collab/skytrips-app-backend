import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateFlightBookingInput {
  @ApiProperty({
    description: 'User ID who made the booking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
  @ApiProperty({
    description: 'Unique booking reference number',
    example: 'BK123456789',
  })
  @IsString()
  @IsNotEmpty()
  booking_id: string;

  @ApiProperty({
    description: 'Current status of the booking',
    example: 'PENDING',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Passenger Name Record (PNR) from the airline',
    example: 'ABC123',
  })
  @IsString()
  @IsNotEmpty()
  passenger_name_record: string;

  @ApiProperty({
    description: 'Manually entered PNR for manual bookings',
    example: 'XYZ789',
    required: false,
  })
  @IsOptional()
  @IsString()
  manual_passenger_name_record?: string;

  @ApiProperty({
    description: 'Flight departure date',
    example: '2024-03-20',
  })
  @IsString()
  @IsNotEmpty()
  departure_date: string;

  @ApiProperty({
    description: 'Flight arrival date',
    example: '2024-03-20',
  })
  @IsString()
  @IsNotEmpty()
  arrival_date: string;

  @ApiProperty({
    description: 'Date and time when the booking was made',
    example: '2024-03-15T14:30:00Z',
  })
  @IsString()
  @IsNotEmpty()
  booked_date: string;

  @ApiProperty({
    description: 'Detailed booking information in JSON format',
  })
  @IsObject()
  @IsNotEmpty()
  detail: any;

  @ApiProperty({
    description: 'Applied coupon details',
    required: false,
  })
  @IsOptional()
  @IsObject()
  coupon_applied?: any;

  @ApiProperty({
    description: 'Admin user ID who handled the booking',
    required: false,
  })
  @IsOptional()
  @IsString()
  handled_by?: string;

  @ApiProperty({
    description: 'Time for admin to process the booking',
    example: '05:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  booking_time?: string;

  @ApiProperty({
    description: 'Type of booking (ONLINE or MANUAL)',
    example: 'ONLINE',
    default: 'ONLINE',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Date when the ticket was issued',
    example: '2024-03-15T16:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  issued_date?: string;

  @ApiProperty({
    description: 'IATA details',
    required: false,
  })
  @IsOptional()
  @IsObject()
  iata?: any;

  @ApiProperty({
    description: 'Cost price of the booking',
    example: 500,
    default: 0,
  })
  @IsNumber()
  cost_price: number;

  @ApiProperty({
    description: 'Selling price of the booking',
    example: 600,
    default: 0,
  })
  @IsNumber()
  selling_price: number;

  @ApiProperty({
    description: 'Profit margin on the booking',
    example: 100,
    default: 0,
  })
  @IsNumber()
  profit: number;

  @ApiProperty({
    description: 'Additional preferences for the flight',
    required: false,
  })
  @IsOptional()
  @IsObject()
  user_flight_additional_preference?: any;

  @ApiProperty({
    description: 'Total number of passengers',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  total_passengers: number;

  @ApiProperty({
    description: 'Travel class of the booking',
    example: 'ECONOMY',
    required: false,
  })
  @IsOptional()
  @IsString()
  travel_class?: string;

  @ApiProperty({
    description: 'Refund status of the booking',
    example: 'NON_REFUNDABLE',
    required: false,
  })
  @IsOptional()
  @IsString()
  booking_ticket_refundable_status?: string;

  @ApiProperty({
    description: 'Type of trip (ONE_WAY or ROUND_TRIP)',
    example: 'ROUND_TRIP',
    required: false,
  })
  @IsOptional()
  @IsString()
  trip_type?: string;

  @ApiProperty({
    description: 'Manual booking reference number',
    example: 'MBK123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  manual_booking_id?: string;

  @ApiProperty({
    description: 'List of flight tickets',
    required: false,
  })
  @IsOptional()
  @IsArray()
  flight_tickets?: any[];

  @ApiProperty({
    description: 'Payment status of the booking',
    example: 'UNPAID',
    default: 'UNPAID',
  })
  @IsString()
  @IsNotEmpty()
  payment_status: string;

  @ApiProperty({
    description: 'Currency code of the booking',
    example: 'AUD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency_code?: string;

  @ApiProperty({
    description: 'Currency country of the booking',
    example: 'Australia',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency_country?: string;

  @ApiProperty({
    description: 'Referral code of the booking',
    example: 'REF123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  referral_code?: string;

  @ApiProperty({
    description: 'Client origin of the booking',
    example: 'www.skytrips.com.au',
    required: false,
  })
  @IsOptional()
  @IsString()
  client_origin?: string;

  @ApiProperty({
    description: 'Origin airport details',
    required: false,
  })
  @IsOptional()
  @IsObject()
  origin_airport?: any;

  @ApiProperty({
    description: 'Destination airport details',
    required: false,
  })
  @IsOptional()
  @IsObject()
  destination_airport?: any;

  @ApiProperty({
    description: 'Whether manual fare was applied to the booking',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_manual_fare_applied?: boolean;

  @ApiProperty({
    description: 'Manual fares applied',
    required: false,
  })
  @IsOptional()
  @IsArray()
  applied_manual_fares?: any[];

  @ApiProperty({
    description: 'Is the booking archived',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_archived?: boolean;

  @ApiProperty({
    description: 'Origin IATA code',
    required: false,
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({
    description: 'Destination IATA code',
    required: false,
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({
    description: 'Arrival time',
    example: '14:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  arrival_time?: string;

  @ApiProperty({
    description: 'Departure time',
    example: '10:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  departure_time?: string;

  @ApiProperty({
    description: 'First departure airline',
    required: false,
  })
  @IsOptional()
  @IsObject()
  first_departure_airline?: any;

  @ApiProperty({
    description: 'Inquiry ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  inquiry_id?: string;

  @ApiProperty({
    description: 'Whether group fare was applied',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_group_fare_applied?: boolean;

  @ApiProperty({
    description: 'Applied group fares',
    required: false,
  })
  @IsOptional()
  @IsArray()
  applied_group_fares?: any[];
}
