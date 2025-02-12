/**
 * This module provides utility functions for working with Graph URIs in TypeScript.
 *
 * @since 0.0.6
 */

type GraphUri = `graph://${string}`;

type SchemeQueryParams = {
  spaceId?: string;
};

const SPACE_SEARCH_PARAM = 's';
const SCHEME_PREFIX = 'graph';

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

export function isValid(value: string): value is GraphUri {
  return value.startsWith(`${SCHEME_PREFIX}://`);
}

export function toEntityId(uri: GraphUri): string {
  const entity = uri.split(`${SCHEME_PREFIX}://`)?.[1]?.split('?')[0];

  if (!entity) {
    throw new Error(`Could not parse entity id from provided URI: ${uri}`);
  }

  return entity;
}

export function toSpaceId(uri: GraphUri): string {
  const url = new URL(uri);
  const searchParams = url.searchParams;

  if (!searchParams.has(SPACE_SEARCH_PARAM)) {
    throw new Error(`Could not parse space id from provided URI: ${uri}`);
  }

  return searchParams.get(SPACE_SEARCH_PARAM) as string;
}
