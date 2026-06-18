import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum HostEventFilter {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  PAST = 'PAST',
}

registerEnumType(HostEventFilter, {
  name: 'HostEventFilter',
  description: 'Filter for host events based on start/end dates',
});

@InputType()
export class GetHostEventsInput {
  @Field(() => HostEventFilter)
  filter: HostEventFilter;

  @Field(() => String, { nullable: true })
  search?: string;
}

@InputType()
export class GetRegisteredAttendeesInput {
  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  passType?: string;

  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;
}
