import {
  IMAGE_HEIGHT_PROPERTY,
  IMAGE_TYPE,
  IMAGE_URL_PROPERTY,
  IMAGE_WIDTH_PROPERTY,
  TYPES_PROPERTY,
} from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid, generate } from '../id-utils.js';
import { uploadImage } from '../ipfs.js';
import type { CreateImageParams, CreateImageResult, PropertiesParam } from '../types.js';
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
 * @returns – {@link CreateImageResult}
 * @throws Will throw an IpfsUploadError if the image cannot be uploaded to IPFS
 */
export const createImage = async ({
  name,
  description,
  id: providedId,
  network,
  ...params
}: CreateImageParams): Promise<CreateImageResult> => {
  if (providedId) assertValid(providedId, '`id` in `createImage`');

  const id = providedId ?? generate();
  const { cid, dimensions } = await uploadImage(params, network, network === 'TESTNET');

  const values: PropertiesParam = [];
  values.push({
    property: IMAGE_URL_PROPERTY,
    value: cid,
  });
  if (dimensions?.height) {
    values.push({
      property: IMAGE_HEIGHT_PROPERTY,
      value: dimensions.height.toString(),
    });
  }
  if (dimensions?.width) {
    values.push({
      property: IMAGE_WIDTH_PROPERTY,
      value: dimensions.width.toString(),
    });
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
      fromEntity: Id(id),
      toEntity: IMAGE_TYPE,
      type: TYPES_PROPERTY,
    },
  });

  return {
    id: Id(id),
    cid,
    dimensions,
    ops,
  };
};
