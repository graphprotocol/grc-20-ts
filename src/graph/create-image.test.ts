import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Id } from '../id.js';
import { SystemIds } from '../system-ids.js';
import { MAINNET_API_ORIGIN, TESTNET_API_ORIGIN } from './constants.js';
import { createImage } from './create-image.js';

// serialized like this:
// const buffer = Buffer.from(await blob.arrayBuffer());
// const base64 = buffer.toString('base64');
// console.log('base64', base64);
const testImageContent =
  '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';

const testImageBlob = new Blob([Buffer.from(testImageContent, 'base64')], { type: 'image/png' });
const ipfsUploadUrl = `${MAINNET_API_ORIGIN}/ipfs/upload-file`;

describe('createImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.toString() === 'http://localhost:3000/image') {
        return Promise.resolve({
          status: 200,
          blob: () => Promise.resolve(testImageBlob),
        } as Response);
      }
      if (url.toString() === ipfsUploadUrl) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ cid: 'ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4' }),
        } as Response);
      }
      if (url.toString() === `${TESTNET_API_ORIGIN}/ipfs/upload-file-alternative-gateway`) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ cid: 'ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4' }),
        } as Response);
      }
      return vi.fn() as never;
    });
  });

  it('creates an image from a url', async () => {
    const image = await createImage({
      url: 'http://localhost:3000/image',
    });

    expect(image).toBeDefined();
    expect(typeof image.id).toBe('string');
    expect(image.cid).toBe('ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4');
    expect(image.dimensions).toBeDefined();
    expect(image.dimensions?.width).toBe(16);
    expect(image.dimensions?.height).toBe(6);
    expect(image.ops).toBeDefined();
    expect(image.ops).toHaveLength(2);
    if (image.ops[0]) {
      expect(image.ops[0].type).toBe('UPDATE_ENTITY');
      if (image.ops[0].type === 'UPDATE_ENTITY') {
        expect(image.ops[0].entity.values).toContainEqual({
          property: SystemIds.IMAGE_URL_PROPERTY,
          value: 'ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4',
        });
      }
    }
    if (image.ops[1]) {
      expect(image.ops[1].type).toBe('CREATE_RELATION');
    }
  });

  it('creates an image on TESTNET from a blob', async () => {
    const image = await createImage({
      blob: testImageBlob,
      network: 'TESTNET',
    });

    expect(image.cid).toMatch(/^ipfs:\/\/ba/);
    expect(image.dimensions).toBeDefined();
    expect(image.ops).toBeDefined();
    expect(image.ops).toHaveLength(2);
    if (image.ops[0]) {
      expect(image.ops[0].type).toBe('UPDATE_ENTITY');
    }
    if (image.ops[1]) {
      expect(image.ops[1].type).toBe('CREATE_RELATION');
    }
  });

  it('creates an image from a blob', async () => {
    const image = await createImage({
      blob: testImageBlob,
    });

    expect(image).toBeDefined();
    expect(typeof image.id).toBe('string');
    expect(image.cid).toBe('ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4');
    expect(image.dimensions).toBeDefined();
    expect(image.dimensions?.width).toBe(16);
    expect(image.dimensions?.height).toBe(6);
    expect(image.ops).toBeDefined();
    expect(image.ops).toHaveLength(2);
    if (image.ops[0]) {
      expect(image.ops[0].type).toBe('UPDATE_ENTITY');
      if (image.ops[0].type === 'UPDATE_ENTITY') {
        expect(image.ops[0].entity.values).toContainEqual({
          property: SystemIds.IMAGE_URL_PROPERTY,
          value: 'ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4',
        });
      }
    }
    if (image.ops[1]) {
      expect(image.ops[1].type).toBe('CREATE_RELATION');
    }
  });

  it('creates an image with a name and description', async () => {
    const image = await createImage({
      url: 'http://localhost:3000/image',
      name: 'test image',
      description: 'test description',
    });

    expect(image).toBeDefined();
    expect(typeof image.id).toBe('string');
    expect(image.ops).toBeDefined();
    expect(image.ops).toHaveLength(2);
    if (image.ops[0]) {
      expect(image.ops[0].type).toBe('UPDATE_ENTITY');
      if (image.ops[0].type === 'UPDATE_ENTITY') {
        expect(image.ops[0].entity.values).toContainEqual({
          property: SystemIds.NAME_PROPERTY,
          value: 'test image',
        });
      }
      if (image.ops[0].type === 'UPDATE_ENTITY') {
        expect(image.ops[0].entity.values).toContainEqual({
          property: SystemIds.DESCRIPTION_PROPERTY,
          value: 'test description',
        });
      }
    }
  });

  it('creates and image without dimensions in case they cannot be determined', async () => {
    const testImageBlob = new Blob([new Uint8Array([0, 0, 0, 0])], { type: 'image/png' });
    const image = await createImage({ blob: testImageBlob });
    expect(image).toBeDefined();
    expect(image.cid).toBe('ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4');
    expect(image.dimensions).toBeUndefined();
    expect(image.ops).toBeDefined();
    expect(image.ops).toHaveLength(2);
    if (image.ops[0]) {
      expect(image.ops[0].type).toBe('UPDATE_ENTITY');
    }
    if (image.ops[1]) {
      expect(image.ops[1].type).toBe('CREATE_RELATION');
    }
  });

  it('creates an image with a provided id', async () => {
    const image = await createImage({
      url: 'http://localhost:3000/image',
      id: Id('8698adc1666145a3bea0482ef419797f'),
    });

    expect(image).toBeDefined();
    expect(image.id).toBe('8698adc1666145a3bea0482ef419797f');
  });

  it('throws an error if the provided id is invalid', async () => {
    await expect(async () => await createImage({ id: 'invalid', url: 'http://localhost:3000/image' })).rejects.toThrow(
      'Invalid id: "invalid" for `id` in `createImage`',
    );
  });

  it('throws an error if the image cannot be uploaded to IPFS', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(url => {
      if (url.toString() === 'http://localhost:3000/image') {
        return Promise.resolve({
          status: 200,
          blob: () => Promise.resolve(testImageBlob),
        } as Response);
      }
      if (url.toString() === ipfsUploadUrl) {
        return Promise.reject(new Error('Failed to upload image to IPFS'));
      }
      return vi.fn() as never;
    });

    await expect(
      createImage({
        url: 'http://localhost:3000/image',
      }),
    ).rejects.toThrow('Could not upload file to IPFS');
  });
});
