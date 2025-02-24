import { write } from './parquet.js';

write({
  data: {
    foo: Array.from({ length: 10000 }, (_, i: number) => i.toString()),
    bar: Array.from({ length: 10000 }, (_, i: number) => (i * 2).toString()),
    baz: Array.from({ length: 10000 }, (_, i: number) => (i * 3).toString()),
  },
  metadata: {
    foo: {
      type: 'TEXT',
      propertyId: 'foo',
    },
    bar: {
      type: 'TEXT',
      propertyId: 'bar',
    },
    baz: {
      type: 'TEXT',
      propertyId: 'baz',
    },
  },
});
