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
 */
const documents = {
  '\n  query CapabilityServiceByPriceIds (\n    $skip: Int!\n    $limit: Int!\n    $priceIds: [String]!\n  ) {\n    purchaseCollection(\n      skip: $skip\n      limit: $limit\n      where: {\n        stripePlanChoices_contains_some: $priceIds\n      }\n    ) {\n      items {\n        stripePlanChoices\n        linkedFrom {\n          offeringCollection (\n            skip: 0\n            limit: 1\n          ) {\n            items {\n              capabilitiesCollection (\n                skip: $skip\n                limit: $limit\n              ) {\n                items {\n                  slug\n                  servicesCollection (\n                    skip: 0\n                    limit: 1\n                  ) {\n                    items {\n                      oauthClientId\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.CapabilityServiceByPriceIdsDocument,
  '\n  query Offering($id: String!, $locale: String!) {\n    offering(id: $id, locale: $locale) {\n      stripeProductId\n      countries\n      defaultPurchase {\n        purchaseDetails {\n          productName\n          details\n          subtitle\n          webIcon\n        }\n      }\n    }\n  }\n':
    types.OfferingDocument,
  '\n  query PurchaseWithDetails($id: String!, $locale: String!) {\n    purchase(id: $id, locale: $locale) {\n      internalName\n      description\n      purchaseDetails {\n        productName\n        details\n        webIcon\n      }\n    }\n  }\n':
    types.PurchaseWithDetailsDocument,
  '\n  query PurchaseWithDetailsOfferingContent(\n    $skip: Int!\n    $limit: Int!\n    $locale: String!\n    $stripePlanIds: [String]!\n  ) {\n    purchaseCollection(\n      skip: $skip\n      limit: $limit\n      locale: $locale\n      where: { stripePlanChoices_contains_some: $stripePlanIds }\n    ) {\n      items {\n        stripePlanChoices\n        purchaseDetails {\n          details\n          productName\n          subtitle\n          webIcon\n        }\n        linkedFrom {\n          offeringCollection(skip: $skip, limit: $limit) {\n            items {\n              stripeProductId\n              commonContent {\n                privacyNoticeUrl\n                privacyNoticeDownloadUrl\n                termsOfServiceUrl\n                termsOfServiceDownloadUrl\n                cancellationUrl\n                emailIcon\n                successActionButtonUrl\n                successActionButtonLabel\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.PurchaseWithDetailsOfferingContentDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CapabilityServiceByPriceIds (\n    $skip: Int!\n    $limit: Int!\n    $priceIds: [String]!\n  ) {\n    purchaseCollection(\n      skip: $skip\n      limit: $limit\n      where: {\n        stripePlanChoices_contains_some: $priceIds\n      }\n    ) {\n      items {\n        stripePlanChoices\n        linkedFrom {\n          offeringCollection (\n            skip: 0\n            limit: 1\n          ) {\n            items {\n              capabilitiesCollection (\n                skip: $skip\n                limit: $limit\n              ) {\n                items {\n                  slug\n                  servicesCollection (\n                    skip: 0\n                    limit: 1\n                  ) {\n                    items {\n                      oauthClientId\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query CapabilityServiceByPriceIds (\n    $skip: Int!\n    $limit: Int!\n    $priceIds: [String]!\n  ) {\n    purchaseCollection(\n      skip: $skip\n      limit: $limit\n      where: {\n        stripePlanChoices_contains_some: $priceIds\n      }\n    ) {\n      items {\n        stripePlanChoices\n        linkedFrom {\n          offeringCollection (\n            skip: 0\n            limit: 1\n          ) {\n            items {\n              capabilitiesCollection (\n                skip: $skip\n                limit: $limit\n              ) {\n                items {\n                  slug\n                  servicesCollection (\n                    skip: 0\n                    limit: 1\n                  ) {\n                    items {\n                      oauthClientId\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Offering($id: String!, $locale: String!) {\n    offering(id: $id, locale: $locale) {\n      stripeProductId\n      countries\n      defaultPurchase {\n        purchaseDetails {\n          productName\n          details\n          subtitle\n          webIcon\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query Offering($id: String!, $locale: String!) {\n    offering(id: $id, locale: $locale) {\n      stripeProductId\n      countries\n      defaultPurchase {\n        purchaseDetails {\n          productName\n          details\n          subtitle\n          webIcon\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PurchaseWithDetails($id: String!, $locale: String!) {\n    purchase(id: $id, locale: $locale) {\n      internalName\n      description\n      purchaseDetails {\n        productName\n        details\n        webIcon\n      }\n    }\n  }\n'
): (typeof documents)['\n  query PurchaseWithDetails($id: String!, $locale: String!) {\n    purchase(id: $id, locale: $locale) {\n      internalName\n      description\n      purchaseDetails {\n        productName\n        details\n        webIcon\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PurchaseWithDetailsOfferingContent(\n    $skip: Int!\n    $limit: Int!\n    $locale: String!\n    $stripePlanIds: [String]!\n  ) {\n    purchaseCollection(\n      skip: $skip\n      limit: $limit\n      locale: $locale\n      where: { stripePlanChoices_contains_some: $stripePlanIds }\n    ) {\n      items {\n        stripePlanChoices\n        purchaseDetails {\n          details\n          productName\n          subtitle\n          webIcon\n        }\n        linkedFrom {\n          offeringCollection(skip: $skip, limit: $limit) {\n            items {\n              stripeProductId\n              commonContent {\n                privacyNoticeUrl\n                privacyNoticeDownloadUrl\n                termsOfServiceUrl\n                termsOfServiceDownloadUrl\n                cancellationUrl\n                emailIcon\n                successActionButtonUrl\n                successActionButtonLabel\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query PurchaseWithDetailsOfferingContent(\n    $skip: Int!\n    $limit: Int!\n    $locale: String!\n    $stripePlanIds: [String]!\n  ) {\n    purchaseCollection(\n      skip: $skip\n      limit: $limit\n      locale: $locale\n      where: { stripePlanChoices_contains_some: $stripePlanIds }\n    ) {\n      items {\n        stripePlanChoices\n        purchaseDetails {\n          details\n          productName\n          subtitle\n          webIcon\n        }\n        linkedFrom {\n          offeringCollection(skip: $skip, limit: $limit) {\n            items {\n              stripeProductId\n              commonContent {\n                privacyNoticeUrl\n                privacyNoticeDownloadUrl\n                termsOfServiceUrl\n                termsOfServiceDownloadUrl\n                cancellationUrl\n                emailIcon\n                successActionButtonUrl\n                successActionButtonLabel\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;