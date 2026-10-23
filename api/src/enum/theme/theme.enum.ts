import { registerEnumType } from '@nestjs/graphql';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

registerEnumType(Theme, {
  name: 'Theme',
});
