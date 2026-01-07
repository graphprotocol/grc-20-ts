/**
 * Example: Creating a Weighted Rank with grc-20-ts
 *
 * This example demonstrates how to use the `createRank` function to create
 * a weighted (scored) rank in the Knowledge Graph.
 */

import { IdUtils, Rank } from '@graphprotocol/grc-20';

// For this example, we'll generate some entity IDs to represent items we want to rank.
// In a real application, these would be existing entity IDs from your Knowledge Graph.
const restaurant1Id = IdUtils.generate();
const restaurant2Id = IdUtils.generate();
const restaurant3Id = IdUtils.generate();

// =============================================================================
// Example 1: Creating a Weighted Rank (Scored List)
// =============================================================================
// Weighted ranks are used when you want to assign numeric scores to items.
// Useful for ratings, reviews, or any scenario where magnitude matters.

const weightedRankResult = Rank.createRank({
  name: 'Restaurant Ratings',
  description: 'My restaurant reviews',
  rankType: 'WEIGHTED',
  votes: [
    { entityId: restaurant1Id, value: 90 }, // Can use any number and scale as needed
    { entityId: restaurant2Id, value: 65 },
    { entityId: restaurant3Id, value: 50 },
  ],
});

console.log('\n=== Weighted Rank Example ===');
console.log('Rank ID:', weightedRankResult.id);
console.log('Number of operations:', weightedRankResult.ops.length);
console.log('Vote entity IDs:', weightedRankResult.voteIds);

// The ops array contains all the operations needed to create this rank:
console.log('\nOperations breakdown:');
for (const op of weightedRankResult.ops) {
  if (op.type === 'UPDATE_ENTITY') {
    console.log(`  - UPDATE_ENTITY: ${op.entity.id}`);
  } else if (op.type === 'CREATE_RELATION') {
    console.log(`  - CREATE_RELATION: ${op.relation.fromEntity} -> ${op.relation.toEntity}`);
  }
}
