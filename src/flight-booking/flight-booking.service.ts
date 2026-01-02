import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FlightBookingEntity } from './entity';
import { CreateFlightBookingInput, UpdateFlightBookingInput } from './dto';
import { PaginationInput, PaginationOutput } from '../common/pagination';

@Injectable()
export class FlightBookingService {
  private readonly tableName = FlightBookingEntity.tableName;

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Create a new flight booking
   */
  async createFlightBooking(
    input: CreateFlightBookingInput,
  ): Promise<FlightBookingEntity> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .insert(input)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(
          `Error creating flight booking: ${error.message}`,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create flight booking: ${error.message}`,
      );
    }
  }

  /**
   * Update an existing flight booking
   */
  async updateFlightBooking(
    id: string,
    updateInput: UpdateFlightBookingInput,
  ): Promise<FlightBookingEntity> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateInput)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(
          `Error updating flight booking: ${error.message}`,
        );
      }

      if (!data) {
        throw new NotFoundException(`Flight booking with ID ${id} not found`);
      }

      return data;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update flight booking: ${error.message}`,
      );
    }
  }

  /**
   * Delete a flight booking
   */
  async deleteFlightBooking(id: string): Promise<{ success: boolean }> {
    try {
      const supabase = this.supabaseService.getClient();

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new BadRequestException(
          `Error deleting flight booking: ${error.message}`,
        );
      }

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete flight booking: ${error.message}`,
      );
    }
  }

  /**
   * Get paginated list of flight bookings with optional filters
   */
  async getFlightBookings(
    whereParams?: Partial<FlightBookingEntity>,
    orderBy?: { column: string; ascending?: boolean },
    paginationInput?: PaginationInput,
  ): Promise<PaginationOutput<FlightBookingEntity>> {
    try {
      const supabase = this.supabaseService.getClient();
      const page = paginationInput?.page || 1;
      const limit = paginationInput?.limit || 10;
      const skip = (page - 1) * limit;

      // Build query
      let query = supabase.from(this.tableName).select('*', { count: 'exact' });

      // Apply filters
      if (whereParams) {
        Object.entries(whereParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? false,
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      query = query.range(skip, skip + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new BadRequestException(
          `Error fetching flight bookings: ${error.message}`,
        );
      }

      return new PaginationOutput(data || [], count || 0, page, limit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch flight bookings: ${error.message}`,
      );
    }
  }

  /**
   * Get a single flight booking by filter
   */
  async getFlightBooking(
    whereParams: Partial<FlightBookingEntity>,
  ): Promise<FlightBookingEntity> {
    try {
      const supabase = this.supabaseService.getClient();

      let query = supabase.from(this.tableName).select('*');

      // Apply filters
      Object.entries(whereParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Flight booking not found');
        }
        throw new BadRequestException(
          `Error fetching flight booking: ${error.message}`,
        );
      }

      return data;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch flight booking: ${error.message}`,
      );
    }
  }

  /**
   * Get flight booking by ID
   */
  async getFlightBookingById(id: string): Promise<FlightBookingEntity> {
    return this.getFlightBooking({ id });
  }

  /**
   * Get all bookings for a specific user
   */
  async getFlightBookingsByUserId(
    userId: string,
    paginationInput?: PaginationInput,
  ): Promise<PaginationOutput<FlightBookingEntity>> {
    return this.getFlightBookings(
      { user_id: userId },
      { column: 'created_at', ascending: false },
      paginationInput,
    );
  }

  /**
   * Get bookings by booking ID
   */
  async getFlightBookingByBookingId(
    bookingId: string,
  ): Promise<FlightBookingEntity> {
    return this.getFlightBooking({ booking_id: bookingId });
  }

  /**
   * Get bookings by status
   */
  async getFlightBookingsByStatus(
    status: string,
    paginationInput?: PaginationInput,
  ): Promise<PaginationOutput<FlightBookingEntity>> {
    return this.getFlightBookings(
      { status },
      { column: 'created_at', ascending: false },
      paginationInput,
    );
  }

  /**
   * Check if flight booking exists
   */
  async flightBookingExists(id: string): Promise<boolean> {
    try {
      await this.getFlightBookingById(id);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }
}
