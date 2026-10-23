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
    let token: string | undefined = undefined;

    // 1. Try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. If not in Authorization header, try to get from cookies
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          if (key && value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      token = cookies['access_token'];
    }

    if (token) {
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
