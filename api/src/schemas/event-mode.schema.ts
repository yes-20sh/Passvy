import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
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
import { EventMode } from '@/enum';

@ObjectType()
@Entity({ name: 'event_modes' })
export class EventModeSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid', unique: true })
  eventId: string;

  @OneToOne(() => EventSchema, (event) => event.mode, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: IEventSchema;

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

  @Field(() => Date, { nullable: true })
  @Column({ name: 'meeting_start_date', type: 'date', nullable: true })
  meetingStartDate: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'meeting_start_time', type: 'time', nullable: true })
  meetingStartTime: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ name: 'meeting_end_date', type: 'date', nullable: true })
  meetingEndDate: Date | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'meeting_end_time', type: 'time', nullable: true })
  meetingEndTime: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'offline_address', type: 'text', nullable: true })
  offlineAddress: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'offline_map_link', type: 'text', nullable: true })
  offlineMapLink: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'offline_landmark', type: 'text', nullable: true })
  offlineLandmark: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'city', type: 'text', nullable: true })
  city: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'state', type: 'text', nullable: true })
  state: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'country', type: 'text', nullable: true })
  country: string | null;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true })
  capacity: number | null;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
