type GetEditCalldataParams = {
  spaceId: string;
  cid: string;
  network?: 'TESTNET' | 'MAINNET';
};

export async function getEditCalldata(params: GetEditCalldataParams) {
  const result = await fetch(`https://api-testnet.grc-20.thegraph.com/space/${params.spaceId}/edit/calldata`, {
    method: 'POST',
    body: JSON.stringify({
      cid: params.cid,
      // Optionally specify TESTNET or MAINNET. Defaults to MAINNET
      network: params.network ?? 'MAINNET',
    }),
  });

  const { to, data } = await result.json();
}
