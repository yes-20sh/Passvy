import { UserSchema } from './user.schema';
import { EventSchema } from './event.schema';
import { EventDescriptionBlockSchema } from './event-description-block.schema';
import { EventPassSchema } from './event-pass.schema';
import { EventCouponSchema } from './event-coupon.schema';
import { EventPaymentSettingSchema } from './event-payment-setting.schema';
import { EventModeSchema } from './event-mode.schema';

const SCHEMAS = [
  UserSchema,
  EventSchema,
  EventDescriptionBlockSchema,
  EventPassSchema,
  EventCouponSchema,
  EventPaymentSettingSchema,
  EventModeSchema,
];

export default SCHEMAS;
