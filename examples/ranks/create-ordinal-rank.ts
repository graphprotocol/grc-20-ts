/**
 * Example: Creating an Ordinal Rank with grc-20-ts
 *
 * This example demonstrates how to use the `createRank` function to create
 * an ordinal (ordered) rank in the Knowledge Graph.
 */

import { IdUtils, Rank } from '@graphprotocol/grc-20';

// For this example, we'll generate some entity IDs to represent items we want to rank.
// In a real application, these would be existing entity IDs from your Knowledge Graph.
const movie1Id = IdUtils.generate();
const movie2Id = IdUtils.generate();
const movie3Id = IdUtils.generate();

// =============================================================================
// Example 1: Creating an Ordinal Rank (Ordered List)
// =============================================================================
// Ordinal ranks are used when you want to rank items by position (1st, 2nd, 3rd, etc.)
// The position is derived from the array order - no need to specify position values!

const ordinalRankResult = Rank.createRank({
  name: 'My Favorite Movies of 2024',
  description: 'A ranked list of my top movies this year',
  rankType: 'ORDINAL',
  votes: [
    { entityId: movie1Id }, // 1st place
    { entityId: movie2Id }, // 2nd place
    { entityId: movie3Id }, // 3rd place
  ],
});

console.log('=== Ordinal Rank Example ===');
console.log('Rank ID:', ordinalRankResult.id);
console.log('Number of operations:', ordinalRankResult.ops.length);
console.log('Vote entity IDs:', ordinalRankResult.voteIds);

// The ops array contains all the operations needed to create this rank:
console.log('\nOperations breakdown:');
for (const op of ordinalRankResult.ops) {
  if (op.type === 'UPDATE_ENTITY') {
    console.log(`  - UPDATE_ENTITY: ${op.entity.id}`);
  } else if (op.type === 'CREATE_RELATION') {
    console.log(`  - CREATE_RELATION: ${op.relation.fromEntity} -> ${op.relation.toEntity}`);
  }
}
