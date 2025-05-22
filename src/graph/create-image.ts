import {
  IMAGE_HEIGHT_PROPERTY,
  IMAGE_TYPE,
  IMAGE_URL_PROPERTY,
  IMAGE_WIDTH_PROPERTY,
  TYPES_PROPERTY,
} from '../core/ids/system.js';
import { assertValid, generate, toBase64 } from '../id.js';
import { uploadImage } from '../ipfs.js';
import type { CreateImageParams, CreateResult, PropertiesParam } from '../types.js';
import { createEntity } from './create-entity.js';

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
      id: toBase64(generate()),
      entity: toBase64(generate()),
      fromEntity: toBase64(id),
      toEntity: toBase64(IMAGE_TYPE),
      type: toBase64(TYPES_PROPERTY),
    },
  });

  return {
    id,
    ops,
  };
};
