/**
 * Utilities for working with Parquet files within the knowledge graph.
 *
 * @since 0.6.2
 */

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
  const table = [];
}

export function read(fileName: string) {
  return new Blob();
}
