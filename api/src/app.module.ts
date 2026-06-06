import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './features/health/health.module';
import { AuthModule } from './features/auth/auth.module';
import { MailModule } from './services/mail/mail.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    AuthModule,
    MailModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'fallback' }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
