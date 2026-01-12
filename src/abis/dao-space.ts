export const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ActionReverted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CanNotExecute',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CanNotVote',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FastPathRestricted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAction',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidCaller',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidFromSpace',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidProposalId',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSetting',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSpaceIdForRole',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OneActionForFastPath',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VerifyDisabled',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DAO',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'EDITOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FAST_PATH_RESTRICTED',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MEMBER',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINIMUM_VOTING_DURATION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RATIO_BASE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SPACE_REGISTRY',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_selector',
        type: 'bytes4',
      },
    ],
    name: 'actionIsFastPathValid',
    outputs: [
      {
        internalType: 'bool',
        name: '_isValid',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_newEditorSpaceId',
        type: 'bytes16',
      },
    ],
    name: 'addEditor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_newMemberSpaceId',
        type: 'bytes16',
      },
    ],
    name: 'addMember',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_action',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_topicInput',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'fetch',
    outputs: [
      {
        internalType: 'bytes32',
        name: '_topicOutput',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_topic',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_flaggedId',
        type: 'bytes',
      },
    ],
    name: 'flag',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_proposalId',
        type: 'bytes16',
      },
    ],
    name: 'getLatestProposalInformation',
    outputs: [
      {
        internalType: 'bool',
        name: '_executed',
        type: 'bool',
      },
      {
        internalType: 'bytes16',
        name: '_creator',
        type: 'bytes16',
      },
      {
        components: [
          {
            internalType: 'enum IDAOSpace.VotingMode',
            name: 'votingMode',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'supportThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quorum',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastDate',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDAOSpace.ProposalParameters',
        name: '_parameters',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'yes',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'no',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'abstain',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDAOSpace.Tally',
        name: '_tally',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct IDAOSpace.Action[]',
        name: '_actions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_proposalId',
        type: 'bytes16',
      },
      {
        internalType: 'bytes16',
        name: '_voterSpaceId',
        type: 'bytes16',
      },
    ],
    name: 'getLatestProposalVote',
    outputs: [
      {
        internalType: 'enum IDAOSpace.VoteOption',
        name: '_voteOption',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_proposalId',
        type: 'bytes16',
      },
      {
        internalType: 'uint8',
        name: '_version',
        type: 'uint8',
      },
    ],
    name: 'getProposalInformation',
    outputs: [
      {
        internalType: 'bool',
        name: '_executed',
        type: 'bool',
      },
      {
        internalType: 'bytes16',
        name: '_creator',
        type: 'bytes16',
      },
      {
        components: [
          {
            internalType: 'enum IDAOSpace.VotingMode',
            name: 'votingMode',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'supportThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quorum',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startDate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastDate',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDAOSpace.ProposalParameters',
        name: '_parameters',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'yes',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'no',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'abstain',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDAOSpace.Tally',
        name: '_tally',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct IDAOSpace.Action[]',
        name: '_actions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_proposalId',
        type: 'bytes16',
      },
      {
        internalType: 'uint8',
        name: '_version',
        type: 'uint8',
      },
      {
        internalType: 'bytes16',
        name: '_voterSpaceId',
        type: 'bytes16',
      },
    ],
    name: 'getProposalVote',
    outputs: [
      {
        internalType: 'enum IDAOSpace.VoteOption',
        name: '_voteOption',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_role',
        type: 'bytes32',
      },
      {
        internalType: 'bytes16',
        name: '_spaceId',
        type: 'bytes16',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '_hasRole',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: '_initializerData',
        type: 'bytes',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_proposalId',
        type: 'bytes16',
      },
    ],
    name: 'isSupportThresholdReached',
    outputs: [
      {
        internalType: 'bool',
        name: '_isSupportThresholdReached',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_proposalId',
        type: 'bytes16',
      },
    ],
    name: 'latestProposalVersion',
    outputs: [
      {
        internalType: 'uint8',
        name: '_version',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_action',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '_topic',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'ping',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_topic',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_editsContentUri',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '_editsMetadata',
        type: 'bytes',
      },
    ],
    name: 'publish',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_oldEditorSpaceId',
        type: 'bytes16',
      },
    ],
    name: 'removeEditor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_oldMemberSpaceId',
        type: 'bytes16',
      },
    ],
    name: 'removeMember',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'spaceRegistry',
    outputs: [
      {
        internalType: 'contract ISpaceRegistry',
        name: '_spaceRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalEditors',
    outputs: [
      {
        internalType: 'uint256',
        name: '_totalEditors',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'typeId',
    outputs: [
      {
        internalType: 'bytes32',
        name: '_type',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_topic',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_unflaggedId',
        type: 'bytes',
      },
    ],
    name: 'unflag',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_spaceId',
        type: 'bytes16',
      },
    ],
    name: 'unrestrictSpace',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'slowPathPercentageThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fastPathFlatThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quorum',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'duration',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDAOSpace.VotingSettings',
        name: '_votingSettings',
        type: 'tuple',
      },
    ],
    name: 'updateVotingSettings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '',
        type: 'bytes16',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    name: 'verify',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [
      {
        internalType: 'string',
        name: '_version',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votingSettings',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'slowPathPercentageThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'fastPathFlatThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quorum',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'duration',
            type: 'uint256',
          },
        ],
        internalType: 'struct IDAOSpace.VotingSettings',
        name: '_votingSettings',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '_fromSpaceId',
        type: 'bytes16',
      },
      {
        internalType: 'bytes32',
        name: '_action',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'write',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
