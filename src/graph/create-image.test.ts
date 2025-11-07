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
  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAMAAAAGcixRAAAAY1BMVEXvvubYz97i2Ojm3Oz4vu3gv+f2yfTqxvDj1v/hxe/u0Pvn1v3Oxc7wx/LHs87r2uzYs7np3++lnaPq1OrZxtjx3PL8xPLG0OXjyuHizeS3qsDfz+nMu8PZtc3TvNjdyO77z/t7oOngAAAACnRSTlP+////y/7e/tbEPoYQ1AAAAAlwSFlzAAALEwAACxMBAJqcGAAAAEhJREFUeNoFwQkCQDAMBMBNgtJL77r5/yvNYPqc1toYM+Pt1VPcgjDGvj4ke2BGS3Y9SSQRUDh7kkKM+5J82OptxNAA55TSyw+IpgNhAhO+gAAAAABJRU5ErkJggg==';

const testImageBlob = new Blob([Buffer.from(testImageContent, 'base64')], { type: 'image/png' });
const ipfsUploadUrl = `${MAINNET_API_ORIGIN}/ipfs/upload-file`;

describe('createImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const originalFetch = global.fetch;
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
      // return the original fetch
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
    expect(image.dimensions?.width).toBe(10);
    expect(image.dimensions?.height).toBe(7);
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

    expect(image).toBeDefined();
  });

  it('creates an image from a blob', async () => {
    const image = await createImage({
      blob: testImageBlob,
    });

    expect(image).toBeDefined();
    expect(typeof image.id).toBe('string');
    expect(image.cid).toBe('ipfs://bafkreidgcqofpstvkzylgxbcn4xan6camlgf564sasepyt45sjgvnojxp4');
    expect(image.dimensions).toBeDefined();
    expect(image.dimensions?.width).toBe(10);
    expect(image.dimensions?.height).toBe(7);
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
      id: Id('8698adc1-6661-45a3-bea0-482ef419797f'),
    });

    expect(image).toBeDefined();
    expect(image.id).toBe('8698adc1-6661-45a3-bea0-482ef419797f');
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
