import {
  Injectable,
  NestMiddleware,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify<Record<string, unknown>>(token, {
          secret: process.env.JWT_SECRET,
        });
        req['user'] = decoded;
      } catch (error) {
        this.logger.error(
          'Invalid or expired JWT token',
          error instanceof Error ? error.stack : error,
        );
        throw new UnauthorizedException(
          'Authentication token is missing or invalid',
        );
      }
    }
    next();
  }
}
