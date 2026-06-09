import { ObjectType, Field } from '@nestjs/graphql';
import { EventListBaseEntity } from './events-list.base.entity';

@ObjectType()
export class CursorPaginationMetaEntity {
  @Field(() => String, { nullable: true })
  nextCursor: string | null;

  @Field(() => Boolean)
  hasNextPage: boolean;
}

@ObjectType()
export class EventsListResponse {
  @Field(() => [EventListBaseEntity])
  events: EventListBaseEntity[];

  @Field(() => CursorPaginationMetaEntity, { nullable: true })
  meta?: CursorPaginationMetaEntity;
}
