import { Micro } from 'effect';
import { DEFAULT_API_ORIGIN } from './graph/constants.js';

class GetEditCalldataError extends Error {
  readonly _tag = 'GetEditCalldataError';
}

type GetEditCalldataParams = {
  spaceId: string;
  cid: string;
  network?: 'TESTNET' | 'MAINNET';
};

export async function getEditCalldata(params: GetEditCalldataParams) {
  const getCalldata = Micro.gen(function* () {
    const result = yield* Micro.tryPromise({
      try: () =>
        fetch(`${DEFAULT_API_ORIGIN}/space/${params.spaceId}/edit/calldata`, {
          method: 'POST',
          body: JSON.stringify({
            cid: params.cid,
            // Optionally specify TESTNET or MAINNET. Defaults to MAINNET
            network: params.network ?? 'MAINNET',
          }),
        }),
      catch: error => new GetEditCalldataError(`Could not get edit calldata from space ${params.spaceId}: ${error}`),
    });

    const calldata = yield* Micro.tryPromise({
      try: async () => {
        const { to, data } = await result.json();
        return {
          to: to as `0x${string}`,
          data: data as `0x${string}`,
        };
      },
      catch: error =>
        new GetEditCalldataError(
          `Could not parse response from API when getting calldata for space ${params.spaceId}: ${error}`,
        ),
    });

    return calldata;
  });

  return await Micro.runPromise(getCalldata);
}
