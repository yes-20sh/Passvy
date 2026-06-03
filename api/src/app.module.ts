import { Module } from '@nestjs/common';
import { HealthModule } from './features/health/health.module';
import { GraphqlConfigModule } from './graphql/graphql.module';

@Module({
  imports: [GraphqlConfigModule, HealthModule],
})
export class AppModule {}
