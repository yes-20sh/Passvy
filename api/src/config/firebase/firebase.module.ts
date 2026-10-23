import { Module } from '@nestjs/common';
import { FirebaseConfigService } from './firebase.service';

@Module({
  providers: [FirebaseConfigService],
  exports: [FirebaseConfigService],
})
export class FirebaseModule {}
