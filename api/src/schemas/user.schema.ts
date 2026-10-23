import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Theme } from '@/enum';

@ObjectType()
@Entity({ name: 'users' })
export class UserSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar' })
  fullName: string;

  @Field()
  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, type: 'varchar', nullable: true })
  mobileNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Field()
  @Column({ type: 'varchar', default: 'LOCAL' })
  authProvider: string;

  @Column({ type: 'varchar', nullable: true })
  googleId: string | null;

  @Field()
  @Column({ type: 'varchar', default: 'USER' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordOtp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordOtpExpires: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @Field(() => Theme, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  theme: string | null;

  @Field(() => [String], { nullable: true })
  @Column({ type: 'simple-array', nullable: true })
  eventPreferences: string[] | null;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
