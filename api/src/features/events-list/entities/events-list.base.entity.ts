import { ObjectType, Field, PickType } from '@nestjs/graphql';
import { EventSchema } from '@/schemas/event.schema';
import { EventModeSchema } from '@/schemas/event-mode.schema';
import { EventPassSchema } from '@/schemas/event-pass.schema';

@ObjectType()
export class EventListModeEntity extends PickType(EventModeSchema, [
  'eventMode',
  'city',
  'state',
  'capacity',
] as const) {}

@ObjectType()
export class EventListPassEntity extends PickType(EventPassSchema, [
  'pricing',
  'price',
] as const) {}

@ObjectType()
export class EventListBaseEntity extends PickType(EventSchema, [
  'id',
  'slug',
  'title',
  'category',
  'headerImage',
  'startDate',
  'startTime',
] as const) {
  @Field(() => EventListModeEntity, { nullable: true })
  mode?: EventListModeEntity;

  @Field(() => [EventListPassEntity], { nullable: true })
  passes?: EventListPassEntity[];

  @Field(() => Boolean, { nullable: true })
  isSaved?: boolean;
}
