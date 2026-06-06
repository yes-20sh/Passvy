import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import SCHEMAS from '../../schemas/schemas';

@Module({
  imports: [TypeOrmModule.forFeature(SCHEMAS)],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
