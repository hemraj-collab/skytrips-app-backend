import { ApiProperty } from '@nestjs/swagger';
import { CommonAttribute } from 'src/common/attribute';

export class FlightBookingEntity extends CommonAttribute {
  static readonly tableName = 'flight_bookings';

  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who made the booking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'Unique booking reference number',
    example: 'BK123456789',
  })
  booking_id: string;

  @ApiProperty({
    description: 'Current status of the booking',
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    description: 'Passenger Name Record (PNR) from the airline',
    example: 'ABC123',
  })
  passenger_name_record: string;

  @ApiProperty({
    description: 'Manually entered PNR for manual bookings',
    example: 'XYZ789',
    required: false,
  })
  manual_passenger_name_record?: string;

  @ApiProperty({
    description: 'Flight departure date',
    example: '2024-03-20',
  })
  departure_date: string;

  @ApiProperty({
    description: 'Flight arrival date',
    example: '2024-03-20',
  })
  arrival_date: string;

  @ApiProperty({
    description: 'Date and time when the booking was made',
    example: '2024-03-15T14:30:00Z',
  })
  booked_date: string;

  @ApiProperty({
    description: 'Detailed booking information in JSON format',
  })
  detail: any;

  @ApiProperty({
    description: 'Applied coupon details in JSON format',
    required: false,
  })
  coupon_applied?: any;

  @ApiProperty({
    description: 'Admin user ID who handled the booking',
    required: false,
  })
  handled_by?: string;

  @ApiProperty({
    description: 'Time for admin to process the booking',
    example: '05:00',
    required: false,
  })
  booking_time?: string;

  @ApiProperty({
    description: 'Type of booking (ONLINE or MANUAL)',
    example: 'ONLINE',
  })
  type: string;

  @ApiProperty({
    description: 'Date when the ticket was issued',
    example: '2024-03-15T16:00:00Z',
    required: false,
  })
  issued_date?: string;

  @ApiProperty({
    description: 'IATA details in JSON format',
    required: false,
  })
  iata?: any;

  @ApiProperty({
    description: 'Cost price of the booking',
    example: 500,
  })
  cost_price: number;

  @ApiProperty({
    description: 'Selling price of the booking',
    example: 600,
  })
  selling_price: number;

  @ApiProperty({
    description: 'Profit margin on the booking',
    example: 100,
  })
  profit: number;

  @ApiProperty({
    description: 'Additional preferences for the flight in JSON format',
    required: false,
  })
  user_flight_additional_preference?: any;

  @ApiProperty({
    description: 'Total number of passengers',
    example: 2,
  })
  total_passengers: number;

  @ApiProperty({
    description: 'Travel class of the booking',
    example: 'ECONOMY',
    required: false,
  })
  travel_class?: string;

  @ApiProperty({
    description: 'Refund status of the booking',
    example: 'NON_REFUNDABLE',
    required: false,
  })
  booking_ticket_refundable_status?: string;

  @ApiProperty({
    description: 'Type of trip (ONE_WAY or ROUND_TRIP)',
    example: 'ROUND_TRIP',
    required: false,
  })
  trip_type?: string;

  @ApiProperty({
    description: 'Manual booking reference number',
    example: 'MBK123456',
    required: false,
  })
  manual_booking_id?: string;

  @ApiProperty({
    description: 'List of flight tickets in JSON format',
    required: false,
  })
  flight_tickets?: any[];

  @ApiProperty({
    description: 'Payment status of the booking',
    example: 'UNPAID',
  })
  payment_status: string;

  @ApiProperty({
    description: 'Currency code of the booking',
    example: 'AUD',
    required: false,
  })
  currency_code?: string;

  @ApiProperty({
    description: 'Currency country of the booking',
    example: 'Australia',
    required: false,
  })
  currency_country?: string;

  @ApiProperty({
    description: 'Referral code of the booking',
    example: 'REF123456',
    required: false,
  })
  referral_code?: string;

  @ApiProperty({
    description: 'Client origin of the booking',
    example: 'www.skytrips.com.au',
    required: false,
  })
  client_origin?: string;

  @ApiProperty({
    description: 'Origin airport details in JSON format',
    required: false,
  })
  origin_airport?: any;

  @ApiProperty({
    description: 'Destination airport details in JSON format',
    required: false,
  })
  destination_airport?: any;

  @ApiProperty({
    description: 'Whether manual fare was applied to the booking',
    example: false,
  })
  is_manual_fare_applied: boolean;

  @ApiProperty({
    description: 'Manual fare applied in JSON format',
    required: false,
  })
  applied_manual_fares?: any[];

  @ApiProperty({
    description: 'Is the booking archived',
    example: false,
  })
  is_archived: boolean;

  @ApiProperty({
    description: 'Origin IATA code of the booking',
    required: false,
  })
  origin?: string;

  @ApiProperty({
    description: 'Destination IATA code of the booking',
    required: false,
  })
  destination?: string;

  @ApiProperty({
    description: 'Arrival time of the booking',
    example: '14:00',
    required: false,
  })
  arrival_time?: string;

  @ApiProperty({
    description: 'Departure time of the booking',
    example: '10:00',
    required: false,
  })
  departure_time?: string;

  @ApiProperty({
    description: 'First departure airline in JSON format',
    required: false,
  })
  first_departure_airline?: any;

  @ApiProperty({
    description: 'Inquiry ID of the booking',
    required: false,
  })
  inquiry_id?: string;

  @ApiProperty({
    description: 'Whether group fare was applied to the booking',
    example: false,
  })
  is_group_fare_applied: boolean;

  @ApiProperty({
    description: 'Applied group fares in JSON format',
    required: false,
  })
  applied_group_fares?: any[];
}
