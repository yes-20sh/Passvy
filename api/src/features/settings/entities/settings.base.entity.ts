import { ObjectType, OmitType } from '@nestjs/graphql';
import { UserSchema } from '../../../schemas/user.schema';

@ObjectType()
export class Settings extends OmitType(UserSchema, [
  'password',
  'googleId',
  'resetPasswordOtp',
  'resetPasswordOtpExpires',
] as const) {}
