/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.6.2
 */

import { readParquet } from 'nodejs-polars';

import { Table as ArrowTable, Schema, Field, Utf8, vectorFromArray, tableToIPC, type Vector } from 'apache-arrow';

import { Compression, Table, writeParquet, WriterPropertiesBuilder } from 'parquet-wasm';

// Test data
function generate(data: WriteOptions['data'], metadata: WriteOptions['metadata']) {
  const schemaFields: Field[] = [];

  for (const [key, value] of Object.entries(metadata)) {
    const metadataMap = new Map(Object.entries(value));

    schemaFields.push(new Field(key, new Utf8(), false, metadataMap));
  }

  const arrowData: Record<string, Vector[]> = {};

  for (const [key, value] of Object.entries(data)) {
    // @ts-expect-error type mismatch
    arrowData[key] = vectorFromArray(value);
  }

  // @ts-expect-error type mismatch
  return new ArrowTable(new Schema(schemaFields), arrowData);
}

type WriteOptions = {
  data: Record<string, unknown[]>;
  metadata: {
    [key: string]: {
      type: string;
      propertyId: string;
    };
  };
};

export function write(options: WriteOptions) {
  const table = generate(options.data, options.metadata);

  const wasmTable = Table.fromIPCStream(tableToIPC(table, 'stream'));
  const writerProperties = new WriterPropertiesBuilder().setCompression(Compression.ZSTD).build();
  return writeParquet(wasmTable, writerProperties);
}

export function read(fileName: string) {
  return readParquet(fileName);
}
