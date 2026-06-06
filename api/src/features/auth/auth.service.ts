import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserBaseEntity } from './entities/auth.base.entity';
import { SignupInput, LoginInput } from './dto/auth.dto';
import { LoginResponse } from './entities/auth.response.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserBaseEntity)
    private readonly userRepository: Repository<UserBaseEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(input: SignupInput): Promise<string> {
    try {
      if (input.password !== input.confirmPassword) {
        throw new ConflictException('Passwords do not match.');
      }

      const existingUser = await this.userRepository.findOne({
        where: [{ email: input.email }, { mobileNumber: input.mobileNumber }],
      });

      if (existingUser) {
        throw new ConflictException(
          existingUser.email === input.email
            ? 'Email is already registered.'
            : 'Mobile number is already registered.',
        );
      }

      const hashedPassword = bcrypt.hashSync(input.password, 10);
      await this.userRepository.save(
        this.userRepository.create({
          fullName: input.fullName,
          email: input.email,
          mobileNumber: input.mobileNumber,
          password: hashedPassword,
        }),
      );

      return 'Signup successful';
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Signup failed', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async login(input: LoginInput, res: Response): Promise<LoginResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: input.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const isPasswordValid = bcrypt.compareSync(input.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Login failed',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Something went wrong during login',
      );
    }
  }
}
