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
    "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.ResetPasswordDocument,
    "mutation Signup($input: SignupInput!) {\n  signup(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.SignupDocument,
    "mutation VerifyOtp($input: VerifyOtpInput!) {\n  verifyOtp(input: $input) {\n    message\n    statusCode\n  }\n}": typeof types.VerifyOtpDocument,
    "query HealthCheck {\n  healthCheck\n}": typeof types.HealthCheckDocument,
};
const documents: Documents = {
    "mutation ForgotPassword($input: ForgotPasswordInput!) {\n  forgotPassword(input: $input) {\n    message\n    statusCode\n  }\n}": types.ForgotPasswordDocument,
    "mutation GoogleAuth($input: GoogleAuthInput!) {\n  googleAuth(input: $input) {\n    accessToken\n    statusCode\n  }\n}": types.GoogleAuthDocument,
    "mutation Login($input: LoginInput!) {\n  login(input: $input) {\n    accessToken\n    statusCode\n  }\n}": types.LoginDocument,
    "mutation ResetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    message\n    statusCode\n  }\n}": types.ResetPasswordDocument,
    "mutation Signup($input: SignupInput!) {\n  signup(input: $input) {\n    message\n    statusCode\n  }\n}": types.SignupDocument,
    "mutation VerifyOtp($input: VerifyOtpInput!) {\n  verifyOtp(input: $input) {\n    message\n    statusCode\n  }\n}": types.VerifyOtpDocument,
    "query HealthCheck {\n  healthCheck\n}": types.HealthCheckDocument,
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
export function gql(source: "query HealthCheck {\n  healthCheck\n}"): (typeof documents)["query HealthCheck {\n  healthCheck\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;