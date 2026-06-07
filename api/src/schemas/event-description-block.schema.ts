import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EventSchema } from './event.schema';
import { BlockType } from '@/enum';

@ObjectType()
@Entity({ name: 'event_description_blocks' })
export class EventDescriptionBlockSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => EventSchema, (event) => event.descriptionBlocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: EventSchema;

  @Field(() => BlockType)
  @Column({ name: 'block_type', type: 'enum', enum: BlockType })
  blockType: BlockType;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'heading_level',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  headingLevel: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'text_size', type: 'varchar', length: 10, nullable: true })
  textSize: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'list_style', type: 'varchar', length: 20, nullable: true })
  listStyle: string | null;

  @Field(() => Int)
  @Column({ name: 'sort_order', type: 'int' })
  sortOrder: number;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
