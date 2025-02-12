export * from './src/types.js';

/**
 * This module provides utility functions for working knowledge graph
 * identifiers in TypeScript.
 *
 * @since 0.0.6
 */
export * as ID from './src/id.js';

/**
 * This module provides utility functions for working with base58 ids
 * in TypeScript.
 *
 * @since 0.0.6
 */
export { BASE58_ALLOWED_CHARS, decodeBase58ToUUID, encodeBase58 } from './src/core/base58.js';

export {
  getAcceptEditorArguments,
  getAcceptSubspaceArguments,
  getCalldataForSpaceGovernanceType,
  getProcessGeoProposalArguments,
  getRemoveEditorArguments,
  getRemoveSubspaceArguments,
} from './src/encodings/index.js';

/**
 * This module provides utility functions for working with knowledge graph
 * images in TypeScript.
 *
 * @since 0.0.6
 */
export { Account } from './src/account.js';

export { TextBlock, DataBlock, ImageBlock } from './src/blocks.js';

/**
 * This module provides utility functions for working with knowledge graph
 * images in TypeScript.
 *
 * @since 0.0.6
 */
export { Image } from './src/image.js';

export { Position, PositionRange } from './src/position.js';

/**
 * This module provides utility functions for working with Triples in TypeScript.
 *
 * @since 0.0.6
 */
export { Triple } from './src/triple.js';

/**
 * This module provides utility functions for working with Relations in TypeScript.
 *
 * @since 0.0.6
 */
export { Relation } from './src/relation.js';

/**
 * This module provides utility functions for working with Graph URIs in TypeScript.
 *
 * @since 0.0.6
 */
export { GraphUrl } from './src/scheme.js';

/**
 * Provides ids for commonly used entities across the Knowledge Graph.
 */
export { SYSTEM_IDS, NETWORK_IDS, CONTENT_IDS } from './src/system-ids.js';

export { getChecksumAddress } from './src/core/get-checksum-address.js';
