import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseConfigService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  onModuleInit(): void {
    if (this.dataSource.isInitialized) {
      this.logger.log(
        'Successfully connected to Supabase PostgreSQL database.',
      );
    } else {
      this.logger.error('Failed to connect to Supabase PostgreSQL database.');
    }
  }
}
