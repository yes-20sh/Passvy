import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventStatus, EventStep } from '@/enum';
import { EventDescriptionBlockSchema } from './event-description-block.schema';
import type { EventDescriptionBlockSchema as IEventDescriptionBlockSchema } from './event-description-block.schema';
import { EventModeSchema } from './event-mode.schema';
import type { EventModeSchema as IEventModeSchema } from './event-mode.schema';
import { EventPassSchema } from './event-pass.schema';
import type { EventPassSchema as IEventPassSchema } from './event-pass.schema';
import { EventCouponSchema } from './event-coupon.schema';
import type { EventCouponSchema as IEventCouponSchema } from './event-coupon.schema';
import { EventPaymentSettingSchema } from './event-payment-setting.schema';
import type { EventPaymentSettingSchema as IEventPaymentSettingSchema } from './event-payment-setting.schema';
import { UserSchema } from './user.schema';

@ObjectType()
@Entity({ name: 'events' })
export class EventSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  slug: string | null;

  @Field(() => String)
  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId: string;

  @ManyToOne(() => UserSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: UserSchema;

  @Field(() => String, { nullable: true })
  @Column({ name: 'header_image', type: 'text', nullable: true })
  headerImage: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @Field(() => EventStatus)
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  @Field(() => EventStep, { nullable: true })
  @Column({ type: 'enum', enum: EventStep, nullable: true })
  stepper: EventStep | null;

  // Relations
  @Field(() => [EventDescriptionBlockSchema], { nullable: true })
  @OneToMany(() => EventDescriptionBlockSchema, (block) => block.event, {
    cascade: true,
  })
  descriptionBlocks: IEventDescriptionBlockSchema[];

  @Field(() => [EventPassSchema], { nullable: true })
  @OneToMany(() => EventPassSchema, (pass) => pass.event, { cascade: true })
  passes: IEventPassSchema[];

  @Field(() => [EventCouponSchema], { nullable: true })
  @OneToMany(() => EventCouponSchema, (coupon) => coupon.event, {
    cascade: true,
  })
  coupons: IEventCouponSchema[];

  @Field(() => EventPaymentSettingSchema, { nullable: true })
  @OneToOne(() => EventPaymentSettingSchema, (setting) => setting.event, {
    cascade: true,
  })
  paymentSetting: IEventPaymentSettingSchema;

  @Field(() => EventModeSchema, { nullable: true })
  @OneToOne(() => EventModeSchema, (mode) => mode.event, {
    cascade: true,
  })
  mode: IEventModeSchema;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
