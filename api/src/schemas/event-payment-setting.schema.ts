import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EventSchema } from './event.schema';
import type { EventSchema as IEventSchema } from './event.schema';

@ObjectType()
@Entity({ name: 'event_payment_settings' })
export class EventPaymentSettingSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid', unique: true })
  eventId: string;

  @OneToOne(() => EventSchema, (event) => event.paymentSetting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: IEventSchema;

  @Field(() => [String])
  @Column({
    name: 'accepted_methods',
    type: 'jsonb',
    default: ['RAZORPAY', 'CHECKIN'],
  })
  acceptedMethods: string[];

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
