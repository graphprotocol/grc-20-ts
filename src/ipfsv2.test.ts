import { it } from 'vitest';
import { WEBSITE_PROPERTY } from './core/idsv2/content.js';
import { createEntity } from './graphv2/create-entity.js';
import { Id } from './idv2.js';
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
    author: Id('b4404fd2-7758-4b3d-8a4c-1146a7f89528'),
  });

  console.log(cid, editId);
});
