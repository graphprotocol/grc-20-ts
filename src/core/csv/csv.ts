/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.6.2
 */

import type { CsvMetadata } from '~/src/types.js';

type WriteOptions = {
  data: Array<Array<string>>;
  metadata: CsvMetadata;
};

export function write(options: WriteOptions) {
  const table = [];
}

export function read(fileName: string) {
  return new Blob();
}
