import { Parquet } from '../../parquet.js';

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'brotli',
  data: {
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  },
});
// @ts-expect-error no Bun namespace
let file = Bun.file('benchmark.parquet');
console.log('brotli', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'gzip',
  data: {
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('gzip', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'lz4',
  data: {
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('lz4', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'snappy',
  data: {
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('snappy', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'zstd',
  data: {
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('zstd', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'uncompressed',
  data: {
    foo: Array.from({ length: 10000 }, (x: number) => x),
    bar: Array.from({ length: 10000 }, (x: number) => x * 2),
    baz: Array.from({ length: 10000 }, (x: number) => x * 3),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('uncompressed', file.size);
