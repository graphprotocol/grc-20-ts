import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Id } from '../id.js';
import { deleteEntity } from './delete-entity.js';

describe('deleteEntity', () => {
  beforeEach(() => {
    // mock graphql request
    vi.mock('graphql-request', () => ({
      request: vi.fn().mockResolvedValue({
        entity: {
          attributes: [
            {
              attribute: Id("X2gz1QCwFju9FwE8MUgbFi"),
            },
          ],
          relations: [
            {
              id: Id("U4WBHFMVfWXM18vGn25Fv3"),
            },
          ],
        },
      }),
      gql: vi.fn(),
    }));
  });

  it('should delete an entity from the graph', async () => {
    const { ops } = await deleteEntity({ id: Id("CffgzbUGPbAadPhAvi9HVy"), space: Id("3JqLpajfPwQJMRT3drhvPu") });
    expect(ops).toEqual([
      {
        type: 'DELETE_TRIPLE',
        triple: {
          attribute: 'X2gz1QCwFju9FwE8MUgbFi',
          entity: 'CffgzbUGPbAadPhAvi9HVy'
        }
      },
      {
        type: 'DELETE_RELATION',
        relation: { id: 'U4WBHFMVfWXM18vGn25Fv3' }
      }
    ])
  })
})
