import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './features/health/health.module';
import { AuthModule } from './features/auth/auth.module';
import { SettingsModule } from './features/settings/settings.module';
import { EventsModule } from './features/events/events.module';
import { EventsListModule } from './features/events-list/events-list.module';
import { EventRegistrationModule } from './features/event-registration/event-registration.module';
import { HostModule } from './features/host/host.module';
import { PassModule } from './features/pass/pass.module';
import { MailModule } from './config/mail/mail.module';
import { PaginationModule } from './service/pagination/pagination.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    AuthModule,
    SettingsModule,
    EventsModule,
    EventsListModule,
    EventRegistrationModule,
    HostModule,
    PassModule,
    MailModule,
    PaginationModule,
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
