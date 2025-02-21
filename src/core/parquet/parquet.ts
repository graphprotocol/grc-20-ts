/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.6.2
 */

import { readParquet, type WriteParquetOptions, DataFrame } from 'nodejs-polars';

export type ParquetCompression = 'zstd' | 'snappy' | 'lz4' | 'brotli' | 'gzip' | 'uncompressed';

// @TODO metadata?
// @TODO is this format useful just exported functions?
export function use() {
  const df = generate({
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  });

  const apiLive = {
    write: df.writeParquet,
    read: readParquet,
  };

  const use = <A>(fn: (api: typeof apiLive) => A) => {
    return fn(apiLive);
  };

  return use;
}

// Test data
function generate(data: WriteOptions['data']) {
  return DataFrame(data);
}

type WriteOptions = {
  compression: ParquetCompression;
  fileName: string;
  data: Record<string, unknown[]>;
};

export function write(options: WriteOptions) {
  const df = generate(options.data);
  df.writeParquet(options.fileName, { compression: options.compression });
}

export function read(fileName: string) {
  const res = readParquet(fileName);
  const cols = res.getColumns();
  console.log(cols);
}
