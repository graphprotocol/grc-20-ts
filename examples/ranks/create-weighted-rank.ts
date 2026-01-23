/**
 * Example: Creating a Weighted Ranking with grc-20-ts
 *
 * This example demonstrates how to use the `createRanking` function to create
 * a weighted (scored) ranking in the Knowledge Graph.
 */

import { IdUtils, Ranking } from '@graphprotocol/grc-20';

// For this example, we'll generate some entity IDs to represent items we want to rank.
// In a real application, these would be existing entity IDs from your Knowledge Graph.
const restaurant1Id = IdUtils.generate();
const restaurant2Id = IdUtils.generate();
const restaurant3Id = IdUtils.generate();

// =============================================================================
// Example 1: Creating a Weighted Ranking (Scored List)
// =============================================================================
// Weighted rankings are used when you want to assign numeric scores to items.
// Useful for ratings, reviews, or any scenario where magnitude matters.

const weightedRankingResult = Ranking.createRanking({
  name: 'Restaurant Ratings',
  description: 'My restaurant reviews',
  rankingType: 'WEIGHTED',
  votes: [
    { entityId: restaurant1Id, score: 90 }, // Can use any number and scale as needed
    { entityId: restaurant2Id, score: 75 }, 
    { entityId: restaurant3Id, score: 50.67 }, // You can also use decimal numbers
  ],
});

console.log('\n=== Weighted Ranking Example ===');
console.log('Ranking ID:', weightedRankingResult.id);
console.log('Number of operations:', weightedRankingResult.ops.length);
console.log('Vote entity IDs:', weightedRankingResult.voteIds);

// The ops array contains all the operations needed to create this ranking:
console.log('\nOperations breakdown:');
for (const op of weightedRankingResult.ops) {
  if (op.type === 'createEntity') {
    console.log(`  - createEntity`);
  } else if (op.type === 'createRelation') {
    console.log(`  - createRelation`);
  }
}
