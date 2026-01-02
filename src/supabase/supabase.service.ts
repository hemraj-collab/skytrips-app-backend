import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Service
 * Manages Supabase client initialization and provides access to the client instance
 * This service is responsible for creating and maintaining the Supabase connection
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabaseClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Initialize Supabase client on module initialization
   */
  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase credentials. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file',
      );
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Get the Supabase client instance
   * @returns {SupabaseClient} The initialized Supabase client
   */
  getClient(): SupabaseClient {
    if (!this.supabaseClient) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabaseClient;
  }

  /**
   * Get Supabase Auth API
   * Provides access to authentication operations
   */
  get auth(): SupabaseClient['auth'] {
    return this.getClient().auth;
  }

  /**
   * Get Supabase Database API
   * Provides access to database operations using the from() method
   */
  get db(): SupabaseClient {
    return this.getClient();
  }

  /**
   * Create a Supabase client with a custom access token
   * Useful for operations that require user-specific permissions
   * @param accessToken - User's access token
   * @returns {SupabaseClient} Supabase client with the provided access token
   */
  getClientWithToken(accessToken: string): SupabaseClient {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }
}
