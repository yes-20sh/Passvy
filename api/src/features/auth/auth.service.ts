import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserBaseEntity } from './entities/auth.base.entity';
import { SignupInput } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserBaseEntity)
    private readonly userRepository: Repository<UserBaseEntity>,
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
}
