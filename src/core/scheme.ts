/**
 * This module provides utility functions for working with Graph URIs in TypeScript.
 *
 * @since 0.0.6
 */

import type { GraphUri } from '../types.js';

type SchemeQueryParams = {
  spaceId?: string;
};

const SPACE_SEARCH_PARAM = 's';
const SCHEME_PREFIX = 'graph';

/**
 * Encodes an entity id into a Graph URI. Optionally, you can specify a space id to be included in the URI.
 *
 * @example
 * ```ts
 * const uri = GraphUrl.fromEntityId('entity-id');
 * console.log(uri); // graph://entity-id
 *
 * const uriWithSpaceId = GraphUrl.fromEntityId('entity-id', { spaceId: 'space-id' });
 * console.log(uriWithSpaceId); // graph://entity-id?s=space-id
 * ```
 *
 * @param entityId base58 encoded v4 uuid
 * @param params optional params: {@link SchemeQueryParams}
 * @returns Graph URI: {@link GraphUri}
 */
export function fromEntityId(entityId: string, params: SchemeQueryParams = {}): GraphUri {
  if (isValid(entityId)) {
    throw new Error(`The passed in entityId should not start with ${SCHEME_PREFIX}://`);
  }

  let uri: GraphUri = `${SCHEME_PREFIX}://${entityId}`;

  if (params.spaceId) {
    uri = `${uri}?${SPACE_SEARCH_PARAM}=${params.spaceId}`;
  }

  return uri;
}

/**
 * Returns true if the provided value is a valid Graph URI.
 *
 * @example
 * ```ts
 * const shouldBeTrue = GraphUrl.isValid('graph://entity-id');
 * console.log(shouldBeTrue); // true
 *
 * const shouldBeFalse = GraphUrl.isValid('entity-id');
 * console.log(shouldBeFalse); // false
 * ```
 *
 * @param value – Graph URI: {@link GraphUri}
 * @returns – `true` if the value is a valid Graph URI, `false` otherwise
 */
export function isValid(value: string): value is GraphUri {
  return value.startsWith(`${SCHEME_PREFIX}://`);
}

/**
 * Decodes the entity id from a Graph URI. Throws an error if the URI is not valid.
 *
 * @example
 * ```ts
 * const entityId = GraphUrl.toEntityId('graph://entity-id');
 * console.log(entityId); // entity-id
 *
 * const entityIdWithSpaceId = GraphUrl.toEntityId('graph://entity-id?s=space-id');
 * console.log(entityIdWithSpaceId); // entity-id
 *
 * const entityId = GraphUrl.toEntityId('invalid-uri'); // throws
 * ```
 *
 * @param uri – Graph URI: {@link GraphUri}
 * @returns – base58 encoded v4 uuid representing an entity
 * @throws Error if the URI is not valid
 */
export function toEntityId(uri: GraphUri): string {
  const entity = uri.split(`${SCHEME_PREFIX}://`)?.[1]?.split('?')[0];

  if (!entity) {
    throw new Error(`Could not parse entity id from provided URI: ${uri}`);
  }

  return entity;
}

/**
 * Decodes the space id from a Graph URI. Throws an error if the URI is not valid.
 *
 * @example
 * ```ts
 * const spaceId = GraphUrl.toSpaceId('graph://entity-id?s=space-id');
 * console.log(spaceId); // space-id
 *
 * const spaceId = GraphUrl.toSpaceId('graph://entity-id'); // throws
 * ```
 *
 * @param uri – Graph URI: {@link GraphUri}
 * @returns – base58 encoded v4 uuid representing a space
 */
export function toSpaceId(uri: GraphUri): string | null {
  const url = new URL(uri);
  const searchParams = url.searchParams;

  if (!searchParams.has(SPACE_SEARCH_PARAM)) {
    return null;
  }

  return searchParams.get(SPACE_SEARCH_PARAM) as string;
}
