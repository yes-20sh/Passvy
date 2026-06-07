/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type BlockType =
  | 'HEADING'
  | 'IMAGE'
  | 'LIST'
  | 'PARAGRAPH';

export type CreateDescriptionBlockInput = {
  blockType: BlockType;
  content?: string | null | undefined;
  headingLevel?: string | null | undefined;
  listStyle?: string | null | undefined;
  sortOrder: number;
  textSize?: string | null | undefined;
};

export type CreateEventCouponInput = {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  usageLimit?: number | null | undefined;
};

export type CreateEventInput = {
  capacity?: number | null | undefined;
  category?: string | null | undefined;
  coupons?: Array<CreateEventCouponInput> | null | undefined;
  descriptionBlocks?: Array<CreateDescriptionBlockInput> | null | undefined;
  endDate?: unknown;
  endTime?: string | null | undefined;
  eventId?: string | null | undefined;
  eventMode: EventMode;
  headerImage?: string | null | undefined;
  offlineAddress?: string | null | undefined;
  offlineLandmark?: string | null | undefined;
  offlineMapLink?: string | null | undefined;
  onlineLink?: string | null | undefined;
  passes?: Array<CreateEventPassInput> | null | undefined;
  paymentSetting?: CreateEventPaymentSettingInput | null | undefined;
  startDate?: unknown;
  startTime?: string | null | undefined;
  status?: EventStatus | null | undefined;
  stepper?: EventStep | null | undefined;
  title: string;
};

export type CreateEventPassInput = {
  customName?: string | null | undefined;
  passCategory?: string | null | undefined;
  price: number;
  pricing: PassPricing;
  quantity?: number | null | undefined;
  tier: PassTier;
};

export type CreateEventPaymentSettingInput = {
  acceptedMethods: Array<string>;
};

export type DiscountType =
  | 'AMOUNT'
  | 'PERCENTAGE';

export type EventMode =
  | 'OFFLINE'
  | 'ONLINE';

export type EventStatus =
  | 'DRAFT'
  | 'PUBLISHED';

export type EventStep =
  | 'DESCRIPTION'
  | 'ESSENTIALS'
  | 'MODE'
  | 'PASSES'
  | 'PAYOUTS';

export type ForgotPasswordInput = {
  email: string;
};

export type GoogleAuthInput = {
  idToken: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type PassPricing =
  | 'FREE'
  | 'PAID';

export type PassTier =
  | 'CUSTOM'
  | 'GA'
  | 'VIP'
  | 'VVIP';

export type ResetPasswordInput = {
  confirmPassword: string;
  email: string;
  newPassword: string;
  otp: string;
};

export type SignupInput = {
  confirmPassword: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  password: string;
};

export type Theme =
  | 'DARK'
  | 'LIGHT';

export type UpdateSettingsInput = {
  avatar?: string | null | undefined;
  eventPreferences?: Array<string> | null | undefined;
  fullName?: string | null | undefined;
  mobileNumber?: string | null | undefined;
  theme?: Theme | null | undefined;
};

export type VerifyOtpInput = {
  email: string;
  otp: string;
};

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { forgotPassword: { message: string, statusCode: number } };

export type GoogleAuthMutationVariables = Exact<{
  input: GoogleAuthInput;
}>;


export type GoogleAuthMutation = { googleAuth: { accessToken: string, statusCode: number } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { accessToken: string, statusCode: number } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { message: string, statusCode: number } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { resetPassword: { message: string, statusCode: number } };

export type SignupMutationVariables = Exact<{
  input: SignupInput;
}>;


export type SignupMutation = { signup: { message: string, statusCode: number } };

export type VerifyOtpMutationVariables = Exact<{
  input: VerifyOtpInput;
}>;


export type VerifyOtpMutation = { verifyOtp: { message: string, statusCode: number } };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { createEvent: { message: string, statusCode: number, event: { id: string, title: string, slug: string | null, headerImage: string | null, startDate: unknown, startTime: string | null, endDate: unknown, endTime: string | null, category: string | null, status: EventStatus, stepper: EventStep | null, createdAt: unknown, updatedAt: unknown, mode: { id: string, eventMode: EventMode, onlineLink: string | null, offlineAddress: string | null, offlineMapLink: string | null, offlineLandmark: string | null, capacity: number | null } | null, descriptionBlocks: Array<{ id: string, blockType: BlockType, content: string | null, headingLevel: string | null, textSize: string | null, listStyle: string | null, sortOrder: number }> | null, passes: Array<{ id: string, pricing: PassPricing, tier: PassTier, customName: string | null, passCategory: string | null, quantity: number | null, price: number }> | null, coupons: Array<{ id: string, code: string, discountType: DiscountType, discountValue: number, usageLimit: number | null }> | null, paymentSetting: { id: string, acceptedMethods: Array<string> } | null } | null } };

export type GetEventQueryVariables = Exact<{
  eventId: string;
}>;


export type GetEventQuery = { getEvent: { message: string, statusCode: number, event: { id: string, title: string, slug: string | null, headerImage: string | null, startDate: unknown, startTime: string | null, endDate: unknown, endTime: string | null, category: string | null, status: EventStatus, stepper: EventStep | null, createdAt: unknown, updatedAt: unknown, mode: { id: string, eventMode: EventMode, onlineLink: string | null, offlineAddress: string | null, offlineMapLink: string | null, offlineLandmark: string | null, capacity: number | null } | null, descriptionBlocks: Array<{ id: string, blockType: BlockType, content: string | null, headingLevel: string | null, textSize: string | null, listStyle: string | null, sortOrder: number }> | null, passes: Array<{ id: string, pricing: PassPricing, tier: PassTier, customName: string | null, passCategory: string | null, quantity: number | null, price: number }> | null, coupons: Array<{ id: string, code: string, discountType: DiscountType, discountValue: number, usageLimit: number | null }> | null, paymentSetting: { id: string, acceptedMethods: Array<string> } | null } | null } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { healthCheck: string };

export type UpdateSettingsMutationVariables = Exact<{
  input: UpdateSettingsInput;
}>;


export type UpdateSettingsMutation = { updateSettings: { success: boolean, message: string, data: { id: string, fullName: string, email: string, mobileNumber: string | null, avatar: string | null, theme: Theme | null, eventPreferences: Array<string> | null } | null } };

export type GetSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSettingsQuery = { getSettings: { success: boolean, message: string, data: { id: string, fullName: string, email: string, mobileNumber: string | null, avatar: string | null, theme: Theme | null, eventPreferences: Array<string> | null } | null } };


export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForgotPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const GoogleAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GoogleAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GoogleAuthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<GoogleAuthMutation, GoogleAuthMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const VerifyOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}}]}}]}}]} as unknown as DocumentNode<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"headerImage"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stepper"}},{"kind":"Field","name":{"kind":"Name","value":"mode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventMode"}},{"kind":"Field","name":{"kind":"Name","value":"onlineLink"}},{"kind":"Field","name":{"kind":"Name","value":"offlineAddress"}},{"kind":"Field","name":{"kind":"Name","value":"offlineMapLink"}},{"kind":"Field","name":{"kind":"Name","value":"offlineLandmark"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descriptionBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"blockType"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"headingLevel"}},{"kind":"Field","name":{"kind":"Name","value":"textSize"}},{"kind":"Field","name":{"kind":"Name","value":"listStyle"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pricing"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"customName"}},{"kind":"Field","name":{"kind":"Name","value":"passCategory"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coupons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentSetting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedMethods"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusCode"}},{"kind":"Field","name":{"kind":"Name","value":"event"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"headerImage"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stepper"}},{"kind":"Field","name":{"kind":"Name","value":"mode"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventMode"}},{"kind":"Field","name":{"kind":"Name","value":"onlineLink"}},{"kind":"Field","name":{"kind":"Name","value":"offlineAddress"}},{"kind":"Field","name":{"kind":"Name","value":"offlineMapLink"}},{"kind":"Field","name":{"kind":"Name","value":"offlineLandmark"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"descriptionBlocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"blockType"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"headingLevel"}},{"kind":"Field","name":{"kind":"Name","value":"textSize"}},{"kind":"Field","name":{"kind":"Name","value":"listStyle"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pricing"}},{"kind":"Field","name":{"kind":"Name","value":"tier"}},{"kind":"Field","name":{"kind":"Name","value":"customName"}},{"kind":"Field","name":{"kind":"Name","value":"passCategory"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coupons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"discountType"}},{"kind":"Field","name":{"kind":"Name","value":"discountValue"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentSetting"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"acceptedMethods"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const HealthCheckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthCheck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"healthCheck"}}]}}]} as unknown as DocumentNode<HealthCheckQuery, HealthCheckQueryVariables>;
export const UpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobileNumber"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"eventPreferences"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const GetSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobileNumber"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"eventPreferences"}}]}}]}}]}}]} as unknown as DocumentNode<GetSettingsQuery, GetSettingsQueryVariables>;