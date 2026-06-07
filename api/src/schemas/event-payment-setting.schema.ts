import { ObjectType, Field, ID } from '@nestjs/graphql';
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
import { PayoutMethod } from '@/enum';

@ObjectType()
@Entity({ name: 'event_payment_settings' })
export class EventPaymentSettingSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_id', type: 'uuid', unique: true })
  eventId: string;

  @OneToOne(() => EventSchema, (event) => event.paymentSetting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: EventSchema;

  @Field(() => [String])
  @Column({
    name: 'accepted_methods',
    type: 'jsonb',
    default: ['RAZORPAY', 'CHECKIN'],
  })
  acceptedMethods: string[];

  @Field(() => PayoutMethod, { nullable: true })
  @Column({
    name: 'payout_method',
    type: 'enum',
    enum: PayoutMethod,
    default: PayoutMethod.BANK,
    nullable: true,
  })
  payoutMethod: PayoutMethod | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'payout_upi_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  payoutUpiId: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'payout_bank_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  payoutBankName: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'payout_account_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  payoutAccountName: string | null;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'payout_account_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  payoutAccountNumber: string | null;

  @Field(() => String, { nullable: true })
  @Column({ name: 'payout_ifsc', type: 'varchar', length: 50, nullable: true })
  payoutIfsc: string | null;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
