import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { GraphqlConfigModule } from './graphql/graphql.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphqlConfigModule,
  ],
})
export class ConfigModule {}
