import { Ipfs } from '~/index.js';
import { stringify } from './csv.js';

const stringified = stringify({
  data: Array.from({ length: 151_000 }, (_, i: number) => [i.toString(), (i * 2).toString(), (i * 3).toString()]),
  metadata: {
    filetype: 'CSV',
    columns: [
      {
        id: 'foo',
        type: 'TEXT',
      },
      {
        id: 'bar',
        type: 'NUMBER',
      },
      {
        id: 'baz',
        type: 'TEXT',
      },
    ],
  },
});

const cid = await Ipfs.uploadCSV(stringified);
console.log('cid', cid);
