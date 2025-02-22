export * from './src/types.js';

/**
 * This module provides utility functions for working knowledge graph
 * identifiers in TypeScript.
 *
 * @since 0.0.6
 */
export * as Id from './src/id.js';

/**
 * This module provides utility functions for working with base58 ids
 * in TypeScript.
 */
export * as Base58 from './src/core/base58.js';

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

export { DataBlock, ImageBlock, TextBlock } from './src/blocks.js';

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
export { ContentIds, NetworkIds, SystemIds } from './src/system-ids.js';

export { getChecksumAddress } from './src/core/get-checksum-address.js';

/**
 * This module provides utility functions for interacting with the default
 * IPFS gateway in TypeScript.
 *
 * @since 0.1.1
 */
export * as Ipfs from './src/ipfs.js';

export * as Graph from './src/graph/index.js';
