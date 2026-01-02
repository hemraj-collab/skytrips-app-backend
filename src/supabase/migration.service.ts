import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);
  private readonly srcPath = path.join(process.cwd(), 'src');

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // Run migrations on startup
    const runMigrations = this.configService.get('RUN_MIGRATIONS', 'false');
    if (runMigrations === 'true') {
      await this.runMigrations();
    }
  }

  /**
   * Scan all module folders for migrations subdirectories
   */
  private getAllMigrationFiles(): Array<{ file: string; path: string }> {
    const migrations: Array<{ file: string; path: string }> = [];

    // Read all directories in src folder
    const moduleFolders = fs
      .readdirSync(this.srcPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // For each module folder, check if it has a migrations subfolder
    for (const moduleFolder of moduleFolders) {
      const migrationsPath = path.join(
        this.srcPath,
        moduleFolder,
        'migrations',
      );

      if (fs.existsSync(migrationsPath)) {
        const files = fs
          .readdirSync(migrationsPath)
          .filter((file) => file.endsWith('.sql'))
          .map((file) => ({
            file,
            path: path.join(migrationsPath, file),
          }));

        migrations.push(...files);
      }
    }

    // Sort by filename (timestamp-based naming ensures correct order)
    return migrations.sort((a, b) => a.file.localeCompare(b.file));
  }

  async runMigrations() {
    const client = new Client({
      connectionString: this.configService.get('DATABASE_URL'),
    });

    try {
      await client.connect();
      this.logger.log('Connected to database for migrations');

      // Create migrations tracking table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.migrations (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          executed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        );
      `);

      // Get all migration files from all modules
      const migrations = this.getAllMigrationFiles();

      if (migrations.length === 0) {
        this.logger.log('No migration files found.');
        return;
      }

      this.logger.log(`Found ${migrations.length} migration file(s)`);

      // Run each migration
      for (const { file, path: filePath } of migrations) {
        const migrationName = file.replace('.sql', '');

        // Check if already run
        const result = await client.query(
          'SELECT id FROM public.migrations WHERE name = $1',
          [migrationName],
        );

        if (result.rows.length > 0) {
          this.logger.log(`✓ Migration ${migrationName} already applied`);
          continue;
        }

        // Read and execute migration
        const sql = fs.readFileSync(filePath, 'utf8');

        this.logger.log(`Running migration: ${migrationName}...`);

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO public.migrations (name) VALUES ($1)',
            [migrationName],
          );
          await client.query('COMMIT');
          this.logger.log(`✅ Migration ${migrationName} applied successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          this.logger.error(
            `❌ Migration ${migrationName} failed: ${error.message}`,
          );
          throw error;
        }
      }

      this.logger.log('🎉 All migrations completed successfully!');
    } catch (error) {
      this.logger.error(`Migration error: ${error.message}`);
      this.logger.error(error.stack);
    } finally {
      await client.end();
    }
  }
}
