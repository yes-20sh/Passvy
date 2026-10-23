import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'event_registrations' })
export class EventRegistrationSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar' })
  slug: string;

  @Field()
  @Column({ type: 'varchar' })
  eventId: string;

  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'varchar' })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  mobileNumber: string | null;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isCheckedIn: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
