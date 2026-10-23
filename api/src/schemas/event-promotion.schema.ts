import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventSchema } from './event.schema';
import type { EventSchema as IEventSchema } from './event.schema';
import { PromotionDuration, PromotionImageSource } from '@/enum';

@ObjectType()
@Entity({ name: 'event_promotions' })
export class EventPromotionSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => EventSchema, (event) => event.promotions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: IEventSchema;

  @Field(() => PromotionDuration)
  @Column({ type: 'varchar', length: 50 })
  duration: PromotionDuration;

  @Field(() => Date)
  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Field(() => Date)
  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Field(() => PromotionImageSource)
  @Column({ name: 'image_source', type: 'varchar', length: 50 })
  imageSource: PromotionImageSource;

  @Field(() => String, { nullable: true })
  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string | null;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
