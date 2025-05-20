import {
  IMAGE_HEIGHT_PROPERTY,
  IMAGE_TYPE,
  IMAGE_URL_PROPERTY,
  IMAGE_WIDTH_PROPERTY,
  TYPES_PROPERTY,
} from '../core/idsv2/system.js';
import { type Id, assertValid, generate } from '../idv2.js';
import { uploadImage } from '../ipfsv2.js';
import type { CreateResult, PropertiesParam } from '../typesv2.js';
import { createEntity } from './create-entity.js';

type CreateImageParams =
  | {
      blob: Blob;
      name?: string;
      description?: string;
      id?: Id;
    }
  | {
      url: string;
      name?: string;
      description?: string;
      id?: Id;
    };

/**
 * Creates an entity with the given name, description, cover, properties, and types.
 * All IDs passed to this function (cover, types, property IDs, relation IDs, etc.) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createImage({
 *   url: 'https://example.com/image.png',
 *   name: 'name of the image', // optional
 *   description: 'description of the image', // optional
 *   id: imageId, // optional and will be generated if not provided
 * });
 *
 * const { id, ops } = createImage({
 *   blob: new Blob(…),
 *   name: 'name of the image', // optional
 *   description: 'description of the image', // optional
 *   id: imageId, // optional and will be generated if not provided
 * });
 * ```
 * @param params – {@link CreateImageParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an IpfsUploadError if the image cannot be uploaded to IPFS
 */
export const createImage = async ({
  name,
  description,
  id: providedId,
  ...params
}: CreateImageParams): Promise<CreateResult> => {
  if (providedId) {
    assertValid(providedId, '`id` in `createImage`');
  }
  const id = providedId ?? generate();
  const { cid, dimensions } = await uploadImage(params);

  const values: PropertiesParam = {};
  values[IMAGE_URL_PROPERTY] = {
    value: cid,
  };
  if (dimensions?.height) {
    values[IMAGE_HEIGHT_PROPERTY] = {
      value: dimensions.height.toString(),
    };
  }
  if (dimensions?.width) {
    values[IMAGE_WIDTH_PROPERTY] = {
      value: dimensions.width.toString(),
    };
  }

  const { ops } = createEntity({
    id,
    name,
    description,
    values,
  });

  ops.push({
    type: 'CREATE_RELATION',
    relation: {
      id: generate(),
      entity: generate(),
      fromEntity: id,
      toEntity: IMAGE_TYPE,
      type: TYPES_PROPERTY,
    },
  });

  return {
    id,
    ops,
  };
};
