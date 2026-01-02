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
import { UserPassengerService } from './user-passenger.service';
import { CreateUserPassengerInput, UpdateUserPassengerInput } from './dto';
import { UserPassengerEntity } from './entity';
import { PaginationInput } from '../common/pagination';

@ApiTags('User Passengers')
@Controller('user-passenger')
export class UserPassengerController {
  constructor(private readonly userPassengerService: UserPassengerService) {}

  /**
   * Create a new user passenger
   */
  @Post(':userId')
  @ApiOperation({ summary: 'Create a new user passenger' })
  @ApiParam({
    name: 'userId',
    type: String,
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User passenger created successfully',
    type: UserPassengerEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createUserPassenger(
    @Param('userId') userId: string,
    @Body() input: CreateUserPassengerInput,
  ): Promise<UserPassengerEntity> {
    return this.userPassengerService.createUserPassenger(userId, input);
  }

  /**
   * Get all user passengers with pagination
   */
  @Get()
  @ApiOperation({ summary: 'Get all user passengers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'user_id',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user passengers retrieved successfully',
  })
  async getUserPassengers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('user_id') userId?: string,
  ) {
    const paginationInput = new PaginationInput();
    paginationInput.page = page ? Number(page) : 1;
    paginationInput.limit = limit ? Number(limit) : 10;

    const whereParams = userId ? { user_id: userId } : undefined;

    return this.userPassengerService.getUserPassengers(
      whereParams,
      { column: 'created_at', ascending: false },
      paginationInput,
    );
  }

  /**
   * Get user passenger by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user passenger by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User passenger ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User passenger retrieved successfully',
    type: UserPassengerEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User passenger not found',
  })
  async getUserPassengerById(
    @Param('id') id: string,
  ): Promise<UserPassengerEntity> {
    return this.userPassengerService.getUserPassengerById(id);
  }

  /**
   * Get all passengers for a specific user
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all passengers for a specific user' })
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
    description: 'User passengers retrieved successfully',
  })
  async getUserPassengersByUserId(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const paginationInput = new PaginationInput();
    paginationInput.page = page ? Number(page) : 1;
    paginationInput.limit = limit ? Number(limit) : 10;

    return this.userPassengerService.getUserPassengersByUserId(
      userId,
      paginationInput,
    );
  }

  /**
   * Update a user passenger
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a user passenger' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User passenger ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User passenger updated successfully',
    type: UserPassengerEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User passenger not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async updateUserPassenger(
    @Param('id') id: string,
    @Body() updateInput: UpdateUserPassengerInput,
  ): Promise<UserPassengerEntity> {
    return this.userPassengerService.updateUserPassenger(id, updateInput);
  }

  /**
   * Delete a user passenger
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a user passenger' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User passenger ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User passenger deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User passenger not found',
  })
  async deleteUserPassenger(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.userPassengerService.deleteUserPassenger(id);
  }

  /**
   * Check if user passenger exists
   */
  @Get(':id/exists')
  @ApiOperation({ summary: 'Check if user passenger exists' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User passenger ID (UUID)',
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
  async userPassengerExists(
    @Param('id') id: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.userPassengerService.userPassengerExists(id);
    return { exists };
  }
}
