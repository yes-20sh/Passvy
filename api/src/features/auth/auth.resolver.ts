import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/auth.dto';
import { LoginResponse } from './entities/auth.response.entity';
import { Public } from '../../decorator/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => String)
  async signup(@Args('input') input: SignupInput): Promise<string> {
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
}
