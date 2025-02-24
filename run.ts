import { Ipfs } from './index.js';

const buffer = await Bun.file('benchmark.parquet').bytes();
const cid = await Ipfs.publishParquet(buffer);
console.log(cid);
