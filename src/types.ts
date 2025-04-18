import type { SafeSmartAccountImplementation } from 'permissionless/accounts';
import type { SmartAccountClient } from 'permissionless/clients';
import type { Address, Chain, HttpTransport } from 'viem';
import type { SmartAccountImplementation } from 'viem/account-abstraction';
import type { Id } from './id.js';

type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ValueType = 'TEXT' | 'NUMBER' | 'CHECKBOX' | 'URL' | 'TIME' | 'POINT';

export type Value = {
  type: ValueType;
  value: string;
  options?: TripleValueOptions;
};

export type TripleValueOptions = {
  format?: string;
  unit?: string;
  language?: string;
};

type Triple = {
  entity: string;
  attribute: string;
  value: Value;
};

type Entity = {
  id: string;
  types: string[];
};

export type CsvMetadata = {
  type: 'CSV';
  columns: {
    id: string;
    type: ValueType | 'RELATION';
    options?: TripleValueOptions;
  }[];
};

export type FileMetadata = CsvMetadata;

export type ImportFileOp = {
  type: 'IMPORT_FILE';
  /**
   * ipfs:// prefixed cid representing the uploaded file
   */
  url: string;
  /**
   * ipfs:// prefixed cid representing metadata about the uploaded file
   */
  metadata: FileMetadata;
};

export type SetBatchTripleOp = {
  type: 'SET_BATCH_TRIPLE';
  entity: Entity;
  triples: Triple[];
};

export type DeleteEntityOp = {
  type: 'DELETE_ENTITY';
  entity: OmitStrict<Entity, 'types'>;
};

export type SetTripleOp = {
  type: 'SET_TRIPLE';
  triple: Triple;
};

export type DeleteTripleOp = {
  type: 'DELETE_TRIPLE';
  triple: OmitStrict<Triple, 'value'>;
};

type Relation = {
  id: string;
  type: string;
  fromEntity: string;
  toEntity: string;
  index: string;
};

export type CreateRelationOp = {
  type: 'CREATE_RELATION';
  relation: Relation;
};

export type DeleteRelationOp = {
  type: 'DELETE_RELATION';
  relation: Pick<Relation, 'id'>;
};

export type Op =
  | SetTripleOp
  | DeleteTripleOp
  | SetBatchTripleOp
  | DeleteEntityOp
  | CreateRelationOp
  | DeleteRelationOp
  | ImportFileOp;

export type EditProposalMetadata = {
  type: 'ADD_EDIT';
  version: '0.0.1';
  name: string;
  ops: Op[];
  // We generate the proposal id on the client so we can pass it to the proposal
  // execution callback passed to a proposal.
  id: string;
  authors: string[];
};

export type MembershipProposalMetadata = {
  type: 'ADD_MEMBER' | 'REMOVE_MEMBER' | 'ADD_EDITOR' | 'REMOVE_EDITOR';
  version: '1.0.0';
  user: `0x${string}`;
  // We generate the proposal id on the client so we can pass it to the proposal
  // execution callback passed to a proposal.
  id: string;
  name?: string;
};

export type SubspaceProposalMetadata = {
  type: 'ADD_SUBSPACE' | 'REMOVE_SUBSPACE';
  version: '1.0.0';
  subspace: `0x${string}`;
  // We generate the proposal id on the client so we can pass it to the proposal
  // execution callback passed to a proposal.
  id: string;
  name?: string;
};

export type ProposalMetadata = EditProposalMetadata | MembershipProposalMetadata | SubspaceProposalMetadata;

export type ProposalType = Uppercase<ProposalMetadata['type']>;

export enum VoteOption {
  None = 0,
  Abstain = 1,
  Yes = 2,
  No = 3,
}

export enum VotingMode {
  Standard = 0,
  EarlyExecution = 1,
}

export type ProposalStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'EXECUTED';

export type GraphUri = `graph://${string}`;

export type DefaultProperties = {
  id?: Id;
  name?: string;
  description?: string;
  cover?: Id;
};

type ValueParams = {
  value: string;
  type: ValueType;
};

type RelationParams = {
  to: Id;
  relationId?: Id;
  position?: string;
  properties?: Record<string, ValueParams | RelationParams | Array<RelationParams>>;
};

export type PropertiesParam = Record<string, ValueParams | RelationParams | Array<RelationParams>>;

export type CreateResult = {
  id: Id;
  ops: Op[];
};

type SafeSmartAccount = SafeSmartAccountImplementation<'0.7'> & {
  address: Address;
  getNonce: NonNullable<SmartAccountImplementation['getNonce']>;
  isDeployed: () => Promise<boolean>;
  type: 'smart';
};

export type GeoSmartAccount = SmartAccountClient<
  HttpTransport<undefined, false>,
  Chain,
  object &
    SafeSmartAccount & {
      address: Address;
      getNonce: NonNullable<SmartAccountImplementation['getNonce']>;
      isDeployed: () => Promise<boolean>;
      type: 'smart';
    },
  undefined,
  undefined
>;
