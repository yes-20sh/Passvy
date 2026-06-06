import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBaseEntity } from './entities/auth.base.entity';
import {
  hashPassword,
  verifyPassword,
} from '../../utils/password/password.util';
import { setAuthCookie, clearAuthCookie } from '../../utils/cookie/cookie.util';
import {
  SignupInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyOtpInput,
  GoogleAuthInput,
} from './dto/auth.dto';
import {
  LoginResponse,
  SuccessResponse,
} from './entities/auth.response.entity';
import { MailService } from '../../services/mail/mail.service';
import { forgotPasswordTemplate } from '@/services/mail/templates/forgot-password.template';
import { FirebaseConfigService } from '../../config/firebase/firebase.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserBaseEntity)
    private readonly userRepository: Repository<UserBaseEntity>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly firebaseConfigService: FirebaseConfigService,
  ) {}

  async googleAuth(
    input: GoogleAuthInput,
    res: Response,
  ): Promise<LoginResponse> {
    try {
      const decodedToken = await this.firebaseConfigService
        .getAuth()
        .verifyIdToken(input.idToken);

      const { email, name, uid } = decodedToken;

      if (!email) {
        throw new UnauthorizedException(
          'Google authentication failed. No email provided.',
        );
      }

      let user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        user = this.userRepository.create({
          email,
          fullName: typeof name === 'string' ? name : 'User',
          authProvider: 'GOOGLE',
          googleId: uid,
          mobileNumber: null,
          password: null,
        });
        await this.userRepository.save(user);
      } else if (user.authProvider !== 'GOOGLE') {
        user.authProvider = 'GOOGLE';
        user.googleId = uid;
        await this.userRepository.save(user);
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      setAuthCookie(res, accessToken);

      return { accessToken, statusCode: HttpStatus.OK };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Google Auth failed',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Something went wrong during Google authentication',
      );
    }
  }

  async signup(input: SignupInput): Promise<SuccessResponse> {
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

      const hashedPassword = hashPassword(input.password);
      await this.userRepository.save(
        this.userRepository.create({
          fullName: input.fullName,
          email: input.email,
          mobileNumber: input.mobileNumber,
          password: hashedPassword,
        }),
      );

      return { message: 'Signup successful', statusCode: HttpStatus.CREATED };
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

      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const isPasswordValid = verifyPassword(input.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password.');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      setAuthCookie(res, accessToken);

      return { accessToken, statusCode: HttpStatus.OK };
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

  async logout(res: Response): Promise<SuccessResponse> {
    try {
      clearAuthCookie(res);
      return { message: 'Logout successful', statusCode: HttpStatus.OK };
    } catch (error) {
      this.logger.error(
        'Logout failed',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Something went wrong during logout',
      );
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<SuccessResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: input.email },
      });
      if (!user) {
        return {
          message:
            'If your email is registered, you will receive an OTP shortly.',
          statusCode: HttpStatus.OK,
        };
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetPasswordOtp = otp;
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15);
      user.resetPasswordOtpExpires = expires;
      await this.userRepository.save(user);
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Reset Your Passvy Password',
        html: forgotPasswordTemplate(otp, user.fullName),
      });
      return {
        message:
          'If your email is registered, you will receive an OTP shortly.',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Forgot password failed', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async verifyOtp(input: VerifyOtpInput): Promise<SuccessResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: input.email, resetPasswordOtp: input.otp },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid or expired OTP.');
      }

      if (
        !user.resetPasswordOtpExpires ||
        user.resetPasswordOtpExpires < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired OTP.');
      }

      return {
        message: 'OTP verified successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Verify OTP failed', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<SuccessResponse> {
    try {
      if (input.newPassword !== input.confirmPassword) {
        throw new ConflictException('Passwords do not match.');
      }

      const user = await this.userRepository.findOne({
        where: { email: input.email, resetPasswordOtp: input.otp },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid or expired OTP.');
      }

      if (
        !user.resetPasswordOtpExpires ||
        user.resetPasswordOtpExpires < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired OTP.');
      }

      const hashedPassword = hashPassword(input.newPassword);
      user.password = hashedPassword;

      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpires = null;

      await this.userRepository.save(user);

      return {
        message: 'Password successfully reset',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Reset password failed', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
