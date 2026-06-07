import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
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
import { EventMode, EventStatus } from '@/enum';
import { EventDescriptionBlockSchema } from './event-description-block.schema';
import { EventPassSchema } from './event-pass.schema';
import { EventCouponSchema } from './event-coupon.schema';
import { EventPaymentSettingSchema } from './event-payment-setting.schema';
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

  @Field(() => EventMode)
  @Column({
    name: 'event_mode',
    type: 'enum',
    enum: EventMode,
    default: EventMode.ONLINE,
  })
  eventMode: EventMode;

  @Field(() => String, { nullable: true })
  @Column({ name: 'online_link', type: 'text', nullable: true })
  onlineLink: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'offline_address', type: 'text', nullable: true })
  offlineAddress: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  capacity: number | null;

  @Field(() => EventStatus)
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  status: EventStatus;

  // Relations
  @Field(() => [EventDescriptionBlockSchema], { nullable: true })
  @OneToMany(() => EventDescriptionBlockSchema, (block) => block.event, {
    cascade: true,
  })
  descriptionBlocks: EventDescriptionBlockSchema[];

  @Field(() => [EventPassSchema], { nullable: true })
  @OneToMany(() => EventPassSchema, (pass) => pass.event, { cascade: true })
  passes: EventPassSchema[];

  @Field(() => [EventCouponSchema], { nullable: true })
  @OneToMany(() => EventCouponSchema, (coupon) => coupon.event, {
    cascade: true,
  })
  coupons: EventCouponSchema[];

  @Field(() => EventPaymentSettingSchema, { nullable: true })
  @OneToOne(() => EventPaymentSettingSchema, (setting) => setting.event, {
    cascade: true,
  })
  paymentSetting: EventPaymentSettingSchema;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
