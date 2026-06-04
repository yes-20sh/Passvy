import {
  Injectable,
  UnauthorizedException,
  Logger,
  OnModuleInit,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserBaseEntity } from './entities/user.base.entity';
import { LoginInput, RegisterInput } from './dto/auth.dto';
import { LoginResponse } from './entities/login-response.entity';
import { UserResponse } from './entities/user.response.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserBaseEntity)
    private readonly userRepository: Repository<UserBaseEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      const userCount = await this.userRepository.count();
      if (userCount === 0) {
        this.logger.log(
          'No users found in database. Seeding a default user...',
        );
        const hashedPassword = bcrypt.hashSync('Solanki@2001', 10);
        const defaultUser = this.userRepository.create({
          email: 'admin@passvy.com',
          password: hashedPassword,
        });
        await this.userRepository.save(defaultUser);
        this.logger.log(
          'Default user created: admin@passvy.com / Solanki@2001',
        );
      }
    } catch (error) {
      this.logger.error('Failed to seed default user', error);
    }
  }

  async login(input: LoginInput): Promise<LoginResponse> {
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

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async register(input: RegisterInput): Promise<UserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const hashedPassword = bcrypt.hashSync(input.password, 10);
    const newUser = this.userRepository.create({
      email: input.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      id: savedUser.id,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
