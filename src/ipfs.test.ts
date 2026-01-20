import { it } from 'vitest';
import { WEBSITE_PROPERTY } from './core/ids/content.js';
import { createEntity } from './graph/create-entity.js';
import { publishEdit } from './ipfs.js';

it('full flow', async () => {
  const { ops } = createEntity({
    name: 'test',
    description: 'test',
    values: [
      {
        property: WEBSITE_PROPERTY,
        type: 'text',
        value: 'test',
      },
    ],
  });

  const { cid, editId } = await publishEdit({
    name: 'test',
    ops,
    author: '0x000000000000000000000000000000000000',
    network: 'TESTNET_V2',
  });

  console.log(cid, editId);
});
