/**
 * Example: Creating an Ordinal Ranking with grc-20-ts
 *
 * This example demonstrates how to use the `createRanking` function to create
 * an ordinal (ordered) ranking in the Knowledge Graph.
 */

import { IdUtils, Ranking } from '@graphprotocol/grc-20';

// For this example, we'll generate some entity IDs to represent items we want to rank.
// In a real application, these would be existing entity IDs from your Knowledge Graph.
const movie1Id = IdUtils.generate();
const movie2Id = IdUtils.generate();
const movie3Id = IdUtils.generate();

// =============================================================================
// Example 1: Creating an Ordinal Ranking (Ordered List)
// =============================================================================
// Ordinal rankings are used when you want to rank items by position (1st, 2nd, 3rd, etc.)
// The position is derived from the array order - no need to specify position values!

const ordinalRankingResult = Ranking.createRanking({
  name: 'My Favorite Movies of 2024',
  description: 'A ranked list of my top movies this year',
  rankingType: 'ORDINAL',
  votes: [
    { entityId: movie1Id }, // 1st place
    { entityId: movie2Id }, // 2nd place
    { entityId: movie3Id }, // 3rd place
  ],
});

console.log('=== Ordinal Ranking Example ===');
console.log('Ranking ID:', ordinalRankingResult.id);
console.log('Number of operations:', ordinalRankingResult.ops.length);
console.log('Vote entity IDs:', ordinalRankingResult.voteIds);

// The ops array contains all the operations needed to create this ranking:
console.log('\nOperations breakdown:');
for (const op of ordinalRankingResult.ops) {
  if (op.type === 'createEntity') {
    console.log(`  - createEntity`);
  } else if (op.type === 'createRelation') {
    console.log(`  - createRelation`);
  }
}
