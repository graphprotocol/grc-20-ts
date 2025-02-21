import { EditProposal } from '~/proto.js';
import { Parquet } from '../../parquet.js';
import type { SetTripleOp } from '~/src/types.js';
import { Triple } from '~/src/triple.js';

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'brotli',
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
});
// @ts-expect-error no Bun namespace
let file = Bun.file('benchmark.parquet');
console.log('brotli', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'gzip',
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('gzip', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'lz4',
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('lz4', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'snappy',
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
});

// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('snappy', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'uncompressed',
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
});
// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('uncompressed', file.size);

Parquet.write({
  fileName: 'benchmark.parquet',
  compression: 'zstd',
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
});

// @ts-expect-error no Bun namespace
file = Bun.file('benchmark.parquet');
console.log('zstd', file.size);

const ops: SetTripleOp[] = [];

for (let i = 0; i < 10000; i++) {
  ops.push(
    Triple.make({
      attributeId: 'foo',
      entityId: i.toString(),
      value: {
        type: 'TEXT',
        value: i.toString(),
      },
    }),
  );
  ops.push(
    Triple.make({
      attributeId: 'foo',
      entityId: i.toString(),
      value: {
        type: 'TEXT',
        value: (i * 2).toString(),
      },
    }),
  );
  ops.push(
    Triple.make({
      attributeId: 'foo',
      entityId: i.toString(),
      value: {
        type: 'TEXT',
        value: (i * 3).toString(),
      },
    }),
  );
}

Bun.write('ops.json', JSON.stringify(ops));

file = Bun.file('ops.json');
console.log('ops uncompressed', file.size);

const edit = EditProposal.encode({ name: 'edit', ops: ops, author: '0x000000000000000000000000000000000000' });
Bun.write('ops.bin', edit);
file = Bun.file('ops.bin');
console.log('edit compressed', file.size);
