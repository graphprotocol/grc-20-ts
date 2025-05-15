import { it } from 'vitest';
import { WEBSITE_PROPERTY } from './core/idsv2/content.js';
import { createEntity } from './graphv2/create-entity.js';
import { publishEdit } from './ipfsv2.js';

it('full flow', async () => {
  const { id, ops } = createEntity({
    name: 'test',
    description: 'test',
    properties: {
      [WEBSITE_PROPERTY]: {
        value: 'test',
      },
    },
  });

  const { cid, editId } = await publishEdit({
    name: 'test',
    ops,
    author: 'test',
  });

  console.log(cid, editId);
});
