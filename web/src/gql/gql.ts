/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation ForgotPassword($input: ForgotPasswordInput!) {\n  forgotPassword(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.ForgotPasswordDocument,
    "mutation GoogleAuth($input: GoogleAuthInput!) {\n  googleAuth(input: $input) {\n    accessToken\n    statusCode\n  }\n}": typeof types.GoogleAuthDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    statusCode\n  }\n}": typeof types.LoginDocument,
    "mutation Logout {\n  logout {\n    message\n    statusCode\n  }\n}": typeof types.LogoutDocument,
    "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.ResetPasswordDocument,
    "mutation Signup($input: SignupInput!) {\n  signup(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.SignupDocument,
    "mutation VerifyOtp($input: VerifyOtpInput!) {\n  verifyOtp(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.VerifyOtpDocument,
    "mutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.CreateEventDocument,
    "query GetEvent($eventId: String!) {\n  getEvent(eventId: $eventId) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}": typeof types.GetEventDocument,
    "query HealthCheck {\n  healthCheck\n}": typeof types.HealthCheckDocument,
    "mutation UpdateSettings($input: UpdateSettingsInput!) {\n  updateSettings(input: $input) {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}": typeof types.UpdateSettingsDocument,
    "query GetSettings {\n  getSettings {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}": typeof types.GetSettingsDocument,
};
const documents: Documents = {
    "mutation ForgotPassword($input: ForgotPasswordInput!) {\n  forgotPassword(input: $input) {\n    message\n    statusCode\n  }\n}": types.ForgotPasswordDocument,
    "mutation GoogleAuth($input: GoogleAuthInput!) {\n  googleAuth(input: $input) {\n    accessToken\n    statusCode\n  }\n}": types.GoogleAuthDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    statusCode\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout {\n    message\n    statusCode\n  }\n}": types.LogoutDocument,
    "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    message\n    statusCode\n  }\n}": types.ResetPasswordDocument,
    "mutation Signup($input: SignupInput!) {\n  signup(input: $input) {\n    message\n    statusCode\n  }\n}": types.SignupDocument,
    "mutation VerifyOtp($input: VerifyOtpInput!) {\n  verifyOtp(input: $input) {\n    message\n    statusCode\n  }\n}": types.VerifyOtpDocument,
    "mutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}": types.CreateEventDocument,
    "query GetEvent($eventId: String!) {\n  getEvent(eventId: $eventId) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}": types.GetEventDocument,
    "query HealthCheck {\n  healthCheck\n}": types.HealthCheckDocument,
    "mutation UpdateSettings($input: UpdateSettingsInput!) {\n  updateSettings(input: $input) {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}": types.UpdateSettingsDocument,
    "query GetSettings {\n  getSettings {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}": types.GetSettingsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ForgotPassword($input: ForgotPasswordInput!) {\n  forgotPassword(input: $input) {\n    message\n    statusCode\n  }\n}"): (typeof documents)["mutation ForgotPassword($input: ForgotPasswordInput!) {\n  forgotPassword(input: $input) {\n    message\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation GoogleAuth($input: GoogleAuthInput!) {\n  googleAuth(input: $input) {\n    accessToken\n    statusCode\n  }\n}"): (typeof documents)["mutation GoogleAuth($input: GoogleAuthInput!) {\n  googleAuth(input: $input) {\n    accessToken\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    statusCode\n  }\n}"): (typeof documents)["mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Logout {\n  logout {\n    message\n    statusCode\n  }\n}"): (typeof documents)["mutation Logout {\n  logout {\n    message\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    message\n    statusCode\n  }\n}"): (typeof documents)["mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    message\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation Signup($input: SignupInput!) {\n  signup(input: $input) {\n    message\n    statusCode\n  }\n}"): (typeof documents)["mutation Signup($input: SignupInput!) {\n  signup(input: $input) {\n    message\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation VerifyOtp($input: VerifyOtpInput!) {\n  verifyOtp(input: $input) {\n    message\n    statusCode\n  }\n}"): (typeof documents)["mutation VerifyOtp($input: VerifyOtpInput!) {\n  verifyOtp(input: $input) {\n    message\n    statusCode\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}"): (typeof documents)["mutation CreateEvent($input: CreateEventInput!) {\n  createEvent(input: $input) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetEvent($eventId: String!) {\n  getEvent(eventId: $eventId) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}"): (typeof documents)["query GetEvent($eventId: String!) {\n  getEvent(eventId: $eventId) {\n    message\n    statusCode\n    event {\n      id\n      title\n      slug\n      headerImage\n      startDate\n      startTime\n      endDate\n      endTime\n      category\n      status\n      stepper\n      mode {\n        id\n        eventMode\n        onlineLink\n        offlineAddress\n        offlineMapLink\n        offlineLandmark\n        capacity\n      }\n      descriptionBlocks {\n        id\n        blockType\n        content\n        headingLevel\n        textSize\n        listStyle\n        sortOrder\n      }\n      passes {\n        id\n        pricing\n        tier\n        customName\n        passCategory\n        quantity\n        price\n      }\n      coupons {\n        id\n        code\n        discountType\n        discountValue\n        usageLimit\n      }\n      paymentSetting {\n        id\n        acceptedMethods\n      }\n      createdAt\n      updatedAt\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query HealthCheck {\n  healthCheck\n}"): (typeof documents)["query HealthCheck {\n  healthCheck\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation UpdateSettings($input: UpdateSettingsInput!) {\n  updateSettings(input: $input) {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}"): (typeof documents)["mutation UpdateSettings($input: UpdateSettingsInput!) {\n  updateSettings(input: $input) {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetSettings {\n  getSettings {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}"): (typeof documents)["query GetSettings {\n  getSettings {\n    success\n    message\n    data {\n      id\n      fullName\n      email\n      mobileNumber\n      avatar\n      theme\n      eventPreferences\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;