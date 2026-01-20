import { createRelation as grcCreateRelation } from '@geoprotocol/grc-20';
import {
  IMAGE_HEIGHT_PROPERTY,
  IMAGE_TYPE,
  IMAGE_URL_PROPERTY,
  IMAGE_WIDTH_PROPERTY,
  TYPES_PROPERTY,
} from '../core/ids/system.js';
import { Id } from '../id.js';
import { assertValid, generate, toGrcId } from '../id-utils.js';
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
  const { cid, dimensions } = await uploadImage(params, network, network === 'TESTNET' || network === 'TESTNET_V2');

  const values: PropertiesParam = [];
  values.push({
    property: IMAGE_URL_PROPERTY,
    type: 'text',
    value: cid,
  });
  if (dimensions?.height) {
    values.push({
      property: IMAGE_HEIGHT_PROPERTY,
      type: 'float64',
      value: dimensions.height,
    });
  }
  if (dimensions?.width) {
    values.push({
      property: IMAGE_WIDTH_PROPERTY,
      type: 'float64',
      value: dimensions.width,
    });
  }

  const { ops } = createEntity({
    id,
    name,
    description,
    values,
  });

  ops.push(
    grcCreateRelation({
      id: toGrcId(generate()),
      entity: toGrcId(generate()),
      from: toGrcId(id),
      to: toGrcId(IMAGE_TYPE),
      relationType: toGrcId(TYPES_PROPERTY),
    }),
  );

  return {
    id: Id(id),
    cid,
    dimensions,
    ops,
  };
};
