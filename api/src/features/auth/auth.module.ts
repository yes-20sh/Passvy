import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import SCHEMAS from '../../schemas/schemas';
import { MailModule } from '../../config/mail/mail.module';
import { FirebaseModule } from '../../config/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(SCHEMAS),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback',
      signOptions: { expiresIn: '1d' },
    }),
    MailModule,
    FirebaseModule,
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
