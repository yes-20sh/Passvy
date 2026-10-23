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
import type { EventSchema as IEventSchema } from './event.schema';
import { PassPricing, PassTier } from '@/enum';

@ObjectType()
@Entity({ name: 'event_passes' })
export class EventPassSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => EventSchema, (event) => event.passes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: IEventSchema;

  @Field(() => PassPricing)
  @Column({ type: 'enum', enum: PassPricing, default: PassPricing.FREE })
  pricing: PassPricing;

  @Field(() => PassTier)
  @Column({ type: 'enum', enum: PassTier, default: PassTier.GA })
  tier: PassTier;

  @Field(() => String, { nullable: true })
  @Column({ name: 'custom_name', type: 'varchar', length: 100, nullable: true })
  customName: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'pass_category',
    type: 'varchar',
    length: 100,
    default: 'SINGLE',
  })
  passCategory: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  quantity: number | null;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
