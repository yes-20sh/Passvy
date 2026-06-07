import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import {
  SignupInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyOtpInput,
  GoogleAuthInput,
} from './dto/auth.dto';
import { LoginResponse } from './entities/auth.response.entity';
import { SuccessResponse } from '@/shared/entities/success.response.entity';
import { Public } from '../../decorator/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SuccessResponse)
  async signup(@Args('input') input: SignupInput): Promise<SuccessResponse> {
    return this.authService.signup(input);
  }

  @Public()
  @Mutation(() => LoginResponse)
  async login(
    @Args('input') input: LoginInput,
    @Context('res') res: Response,
  ): Promise<LoginResponse> {
    return this.authService.login(input, res);
  }

  @Public()
  @Mutation(() => SuccessResponse)
  async logout(@Context('res') res: Response): Promise<SuccessResponse> {
    return this.authService.logout(res);
  }

  @Public()
  @Mutation(() => LoginResponse)
  async googleAuth(
    @Args('input') input: GoogleAuthInput,
    @Context('res') res: Response,
  ): Promise<LoginResponse> {
    return this.authService.googleAuth(input, res);
  }

  @Public()
  @Mutation(() => SuccessResponse)
  async forgotPassword(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<SuccessResponse> {
    return this.authService.forgotPassword(input);
  }

  @Public()
  @Mutation(() => SuccessResponse)
  async verifyOtp(
    @Args('input') input: VerifyOtpInput,
  ): Promise<SuccessResponse> {
    return this.authService.verifyOtp(input);
  }

  @Public()
  @Mutation(() => SuccessResponse)
  async resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<SuccessResponse> {
    return this.authService.resetPassword(input);
  }
}
