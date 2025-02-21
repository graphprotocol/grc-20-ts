import { Parquet } from '~/src/parquet.js';

const file = Parquet.read('ipfs.parquet');
console.log(file.dtypes);

const benchmark = Parquet.read('benchmark.parquet');
console.log(benchmark.getColumns());
