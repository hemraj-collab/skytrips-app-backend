import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UserPassengerEntity } from './entity';
import { CreateUserPassengerInput, UpdateUserPassengerInput } from './dto';
import { PaginationInput, PaginationOutput } from '../common/pagination';

@Injectable()
export class UserPassengerService {
  private readonly tableName = UserPassengerEntity.tableName;

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Create a new user passenger
   */
  async createUserPassenger(
    userId: string,
    input: CreateUserPassengerInput,
  ): Promise<UserPassengerEntity> {
    try {
      const supabase = this.supabaseService.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .insert({ ...input, user_id: userId })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(
          `Error creating user passenger: ${error.message}`,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create user passenger: ${error.message}`,
      );
    }
  }

  /**
   * Update an existing user passenger
   */
  async updateUserPassenger(
    id: string,
    updateInput: UpdateUserPassengerInput,
  ): Promise<UserPassengerEntity> {
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
          `Error updating user passenger: ${error.message}`,
        );
      }

      if (!data) {
        throw new NotFoundException(`User passenger with ID ${id} not found`);
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
        `Failed to update user passenger: ${error.message}`,
      );
    }
  }

  /**
   * Delete a user passenger
   */
  async deleteUserPassenger(id: string): Promise<{ success: boolean }> {
    try {
      const supabase = this.supabaseService.getClient();

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new BadRequestException(
          `Error deleting user passenger: ${error.message}`,
        );
      }

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete user passenger: ${error.message}`,
      );
    }
  }

  /**
   * Get paginated list of user passengers with optional filters
   */
  async getUserPassengers(
    whereParams?: Partial<UserPassengerEntity>,
    orderBy?: { column: string; ascending?: boolean },
    paginationInput?: PaginationInput,
  ): Promise<PaginationOutput<UserPassengerEntity>> {
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
          `Error fetching user passengers: ${error.message}`,
        );
      }

      return new PaginationOutput(data || [], count || 0, page, limit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch user passengers: ${error.message}`,
      );
    }
  }

  /**
   * Get a single user passenger by filter
   */
  async getUserPassenger(
    whereParams: Partial<UserPassengerEntity>,
  ): Promise<UserPassengerEntity> {
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
          throw new NotFoundException('User passenger not found');
        }
        throw new BadRequestException(
          `Error fetching user passenger: ${error.message}`,
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
        `Failed to fetch user passenger: ${error.message}`,
      );
    }
  }

  /**
   * Get user passenger by ID
   */
  async getUserPassengerById(id: string): Promise<UserPassengerEntity> {
    return this.getUserPassenger({ id });
  }

  /**
   * Get all passengers for a specific user
   */
  async getUserPassengersByUserId(
    userId: string,
    paginationInput?: PaginationInput,
  ): Promise<PaginationOutput<UserPassengerEntity>> {
    return this.getUserPassengers(
      { user_id: userId },
      { column: 'created_at', ascending: false },
      paginationInput,
    );
  }

  /**
   * Check if user passenger exists
   */
  async userPassengerExists(id: string): Promise<boolean> {
    try {
      await this.getUserPassengerById(id);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }
}
