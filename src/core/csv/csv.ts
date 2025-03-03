import * as Csv from '@std/csv';
/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.6.2
 */
import type { CsvMetadata, ValueType } from '~/src/types.js';

type WriteOptions = {
  data: Array<Csv.DataItem>;
  metadata: CsvMetadata;
};

export function write(options: WriteOptions) {
  const columns = options.metadata.columns.map((c, i): Csv.ColumnDetails => {
    return {
      header: c.id,
      prop: i,
    };
  });

  const stringified = Csv.stringify(options.data, { columns, headers: true });

  // @TODO: Write metadata
  // @TODO: Write string to IPFS as compressed CSV

  return {
    metadata: options.metadata,
    csv: stringified,
  };
}

export function read(fileName: string) {
  return new Blob();
}
