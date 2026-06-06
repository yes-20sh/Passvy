import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserBaseEntity } from './entities/auth.base.entity';
import { SignupInput } from './dto/auth.dto';
import { SignupResponse } from './entities/auth.response.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserBaseEntity)
    private readonly userRepository: Repository<UserBaseEntity>,
  ) {}

  async signup(input: SignupInput): Promise<SignupResponse> {
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
    const savedUser = await this.userRepository.save(
      this.userRepository.create({
        fullName: input.fullName,
        email: input.email,
        mobileNumber: input.mobileNumber,
        password: hashedPassword,
      }),
    );

    return {
      message: 'Signup successful',
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        mobileNumber: savedUser.mobileNumber,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    };
  }
}
