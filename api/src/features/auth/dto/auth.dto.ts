import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Mobile number is required' })
  mobileNumber: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;

  @Field()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;

  @Field()
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}

@InputType()
export class GoogleAuthInput {
  @Field()
  @IsNotEmpty({ message: 'Firebase ID token is required' })
  idToken: string;
}
