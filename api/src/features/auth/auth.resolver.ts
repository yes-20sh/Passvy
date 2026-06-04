import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/auth.dto';
import { LoginResponse } from './entities/login-response.entity';
import { UserResponse } from './entities/user.response.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, { name: 'login' })
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    return this.authService.login(input);
  }

  @Mutation(() => UserResponse, { name: 'register' })
  async register(@Args('input') input: RegisterInput): Promise<UserResponse> {
    return this.authService.register(input);
  }
}
