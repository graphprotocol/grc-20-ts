import { Image } from '../image.js';
import { uploadImage } from '../ipfs.js';
import type { Op } from '../types.js';
type CreateImageParams =
  | {
      blob: Blob;
    }
  | {
      url: string;
    };

export const createImage = async (params: CreateImageParams) => {
  const ops: Array<Op> = [];
  const { cid, dimensions } = await uploadImage(params);

  // TODO also add dimensions to the image entity
  const { imageId, ops: imageOps } = Image.make(cid);
  ops.push(...imageOps);

  return {
    id: imageId,
    ops,
  };
};
