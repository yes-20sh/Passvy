import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventSchema } from './event.schema';
import { DiscountType } from '@/enum';

@ObjectType()
@Entity({ name: 'event_coupons' })
export class EventCouponSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => EventSchema, (event) => event.coupons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: EventSchema;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Field(() => DiscountType)
  @Column({ name: 'discount_type', type: 'enum', enum: DiscountType })
  discountType: DiscountType;

  @Field(() => Float)
  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit: number | null;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
