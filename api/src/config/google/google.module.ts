import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleService } from './google.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
