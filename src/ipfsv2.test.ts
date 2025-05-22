import { it } from 'vitest';
import { WEBSITE_PROPERTY } from './core/idsv2/content.js';
import { createEntity } from './graphv2/create-entity.js';
import { publishEdit } from './ipfsv2.js';

it('full flow', async () => {
  const { id, ops } = createEntity({
    name: 'test',
    description: 'test',
    values: {
      [WEBSITE_PROPERTY]: {
        value: 'test',
      },
    },
  });

  const { cid, editId } = await publishEdit({
    name: 'test',
    ops,
    author: '0x000000000000000000000000000000000000',
  });

  console.log(cid, editId);
});
