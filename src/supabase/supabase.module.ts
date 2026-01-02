import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

/**
 * Supabase Module
 * Global module that provides Supabase client access throughout the application
 * Import this module in AppModule to make SupabaseService available everywhere
 */
@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
