import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { HostEventFilter } from '../dto/host-event.dto';

@ObjectType()
export class HostEventData {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  slug: string | null;

  @Field(() => String, { nullable: true })
  headerImage: string | null;

  @Field(() => String)
  title: string;

  @Field(() => String)
  category: string;

  @Field(() => Int)
  registeredCount: number;

  @Field(() => Date, { nullable: true })
  startDate: Date | null;

  @Field(() => String, { nullable: true })
  startTime: string | null;

  @Field(() => Date, { nullable: true })
  endDate: Date | null;

  @Field(() => String, { nullable: true })
  endTime: string | null;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => Boolean, { nullable: true })
  isOnline: boolean | null;

  @Field(() => HostEventFilter)
  status: HostEventFilter;
}

@ObjectType()
export class HostEventsResponse {
  @Field(() => [HostEventData])
  events: HostEventData[];
}

@ObjectType()
export class PaginationMetaEntity {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;
}

@ObjectType()
export class RegisteredAttendeeData {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  mobileNumber?: string | null;

  @Field(() => String)
  passType: string;

  @Field(() => String)
  ticketId: string;

  @Field(() => Date)
  registerDate: Date;

  @Field(() => String)
  status: string;
}

@ObjectType()
export class RegisteredAttendeesResponse {
  @Field(() => [RegisteredAttendeeData])
  data: RegisteredAttendeeData[];

  @Field(() => PaginationMetaEntity)
  meta: PaginationMetaEntity;
}
