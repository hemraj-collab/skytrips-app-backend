import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FlightBookingService } from './flight-booking.service';
import { CreateFlightBookingInput, UpdateFlightBookingInput } from './dto';
import { FlightBookingEntity } from './entity';
import { PaginationInput } from '../common/pagination';

@ApiTags('Flight Bookings')
@Controller('flight-booking')
export class FlightBookingController {
  constructor(private readonly flightBookingService: FlightBookingService) {}

  /**
   * Create a new flight booking
   */
  @Post()
  @ApiOperation({ summary: 'Create a new flight booking' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Flight booking created successfully',
    type: FlightBookingEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createFlightBooking(
    @Body() input: CreateFlightBookingInput,
  ): Promise<FlightBookingEntity> {
    return this.flightBookingService.createFlightBooking(input);
  }

  /**
   * Get all flight bookings with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all flight bookings with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'user_id',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of flight bookings retrieved successfully',
  })
  async getFlightBookings(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('user_id') userId?: string,
    @Query('status') status?: string,
  ) {
    const paginationInput = new PaginationInput();
    paginationInput.page = page ? Number(page) : 1;
    paginationInput.limit = limit ? Number(limit) : 10;

    const whereParams: any = {};
    if (userId) whereParams.user_id = userId;
    if (status) whereParams.status = status;

    return this.flightBookingService.getFlightBookings(
      Object.keys(whereParams).length > 0 ? whereParams : undefined,
      { column: 'created_at', ascending: false },
      paginationInput,
    );
  }

  /**
   * Get flight booking by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get flight booking by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flight booking ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Flight booking retrieved successfully',
    type: FlightBookingEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Flight booking not found',
  })
  async getFlightBookingById(
    @Param('id') id: string,
  ): Promise<FlightBookingEntity> {
    return this.flightBookingService.getFlightBookingById(id);
  }

  /**
   * Get flight booking by booking ID
   */
  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get flight booking by booking ID' })
  @ApiParam({
    name: 'bookingId',
    type: String,
    description: 'Booking reference number',
    example: 'BK123456789',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Flight booking retrieved successfully',
    type: FlightBookingEntity,
  })
  async getFlightBookingByBookingId(
    @Param('bookingId') bookingId: string,
  ): Promise<FlightBookingEntity> {
    return this.flightBookingService.getFlightBookingByBookingId(bookingId);
  }

  /**
   * Get all bookings for a specific user
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all bookings for a specific user' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User flight bookings retrieved successfully',
  })
  async getFlightBookingsByUserId(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const paginationInput = new PaginationInput();
    paginationInput.page = page ? Number(page) : 1;
    paginationInput.limit = limit ? Number(limit) : 10;

    return this.flightBookingService.getFlightBookingsByUserId(
      userId,
      paginationInput,
    );
  }

  /**
   * Get bookings by status
   */
  @Get('status/:status')
  @ApiOperation({ summary: 'Get bookings by status' })
  @ApiParam({
    name: 'status',
    type: String,
    description: 'Booking status',
    example: 'PENDING',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Flight bookings retrieved successfully',
  })
  async getFlightBookingsByStatus(
    @Param('status') status: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const paginationInput = new PaginationInput();
    paginationInput.page = page ? Number(page) : 1;
    paginationInput.limit = limit ? Number(limit) : 10;

    return this.flightBookingService.getFlightBookingsByStatus(
      status,
      paginationInput,
    );
  }

  /**
   * Update a flight booking
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a flight booking' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flight booking ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Flight booking updated successfully',
    type: FlightBookingEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Flight booking not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async updateFlightBooking(
    @Param('id') id: string,
    @Body() updateInput: UpdateFlightBookingInput,
  ): Promise<FlightBookingEntity> {
    return this.flightBookingService.updateFlightBooking(id, updateInput);
  }

  /**
   * Delete a flight booking
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a flight booking' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flight booking ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Flight booking deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Flight booking not found',
  })
  async deleteFlightBooking(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.flightBookingService.deleteFlightBooking(id);
  }

  /**
   * Check if flight booking exists
   */
  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if flight booking exists' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Flight booking ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Existence check completed',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean', example: true },
      },
    },
  })
  async flightBookingExists(
    @Param('id') id: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.flightBookingService.flightBookingExists(id);
    return { exists };
  }
}
