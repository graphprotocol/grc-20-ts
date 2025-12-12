import { encodeFunctionData, stringToHex } from 'viem';

import { MainVotingAbi, PersonalSpaceAdminAbi } from '../abis/index.js';

type GovernanceTypeCalldataParams = {
  type: 'PUBLIC' | 'PERSONAL';
  cid: string;
  spacePluginAddress: string;
};

export function getCalldataForSpaceGovernanceType(args: GovernanceTypeCalldataParams) {
  switch (args.type) {
    case 'PUBLIC':
      return encodeFunctionData({
        functionName: 'proposeEdits',
        abi: MainVotingAbi,
        args: [stringToHex(args.cid), args.cid, '0x', args.spacePluginAddress as `0x${string}`],
      });
    case 'PERSONAL':
      return encodeFunctionData({
        functionName: 'submitEdits',
        abi: PersonalSpaceAdminAbi,
        args: [args.cid, '0x', args.spacePluginAddress as `0x${string}`],
      });
  }
}
