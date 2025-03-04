/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.9.0
 */
import * as Csv from '@std/csv';

import type { CsvMetadata } from '~/src/types.js';

type WriteOptions = {
  data: Array<Csv.DataItem>;
  metadata: CsvMetadata;
};

export function stringify(options: WriteOptions): string {
  const columns = options.metadata.columns.map((c, i): Csv.ColumnDetails => {
    return {
      header: c.id,
      prop: i,
    };
  });

  return Csv.stringify(options.data, { columns, headers: true });
}

export function read(fileName: string) {
  return new Blob();
}
