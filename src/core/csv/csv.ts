/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.9.0
 */

import type { CsvMetadata } from '~/src/types.js';

type WriteOptions = {
  // data: Array<Csv.DataItem>;
  data: Array<unknown>;
  metadata: CsvMetadata;
};

export function stringify(options: WriteOptions): string {
  const columns = options.metadata.columns.map((c, i): unknown => {
    return {
      header: c.id,
      prop: i,
    };
  });

  throw new Error("Not implemented")
  // return Csv.stringify(options.data, { columns, headers: true });
}

export function read(fileName: string) {
  return new Blob();
}
