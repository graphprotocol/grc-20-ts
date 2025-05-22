import type { SafeSmartAccountImplementation } from 'permissionless/accounts';
import type { SmartAccountClient } from 'permissionless/clients';
import type { Address, Chain, HttpTransport } from 'viem';
import type { SmartAccountImplementation } from 'viem/account-abstraction';
import type { Id, IdBase64 } from './id.js';

export type ValueType = 'TEXT' | 'NUMBER' | 'CHECKBOX' | 'URL' | 'TIME' | 'POINT';

export type Value = {
  propertyId: IdBase64;
  value: string;
};

export type Entity = {
  id: IdBase64;
  values: Array<Value>;
};

export type Relation = {
  id: IdBase64;
  type: IdBase64;
  fromEntity: IdBase64;
  fromSpace?: IdBase64;
  fromVersion?: IdBase64;
  toEntity: IdBase64;
  toSpace?: IdBase64;
  toVersion?: IdBase64;
  entity: IdBase64;
  position?: string;
  verified?: boolean;
};

export type UpdateEntityOp = {
  type: 'UPDATE_ENTITY';
  entity: Entity;
};

export type UnsetEntityValuesOp = {
  type: 'UNSET_ENTITY_VALUES';
  unsetEntityValues: {
    id: IdBase64;
    properties: IdBase64[];
  };
};

export type DeleteEntityOp = {
  type: 'DELETE_ENTITY';
  id: IdBase64;
};

export type CreateRelationOp = {
  type: 'CREATE_RELATION';
  relation: Relation;
};

export type DeleteRelationOp = {
  type: 'DELETE_RELATION';
  id: IdBase64;
};

export type UpdateRelationOp = {
  type: 'UPDATE_RELATION';
  relation: Pick<Relation, 'id' | 'position' | 'fromSpace' | 'toSpace' | 'fromVersion' | 'toVersion' | 'verified'>;
};

export type UnsetRelationFieldsOp = {
  type: 'UNSET_RELATION_FIELDS';
  unsetRelationFields: {
    id: IdBase64;
    fromSpace?: boolean;
    fromVersion?: boolean;
    toSpace?: boolean;
    toVersion?: boolean;
    position?: boolean;
    verified?: boolean;
  };
};

export type Op =
  | UpdateEntityOp
  | DeleteEntityOp
  | CreateRelationOp
  | DeleteRelationOp
  | UpdateRelationOp
  | UnsetEntityValuesOp
  | UnsetRelationFieldsOp;

type ValueParams = {
  value: string;
};

export type DefaultProperties = {
  id?: Id;
  name?: string;
  description?: string;
  cover?: Id;
};

export type PropertiesParam = Record<Id, ValueParams>;

export type RelationsParam = Record<Id, RelationParams | Array<RelationParams>>;

export type EntityParams = DefaultProperties & {
  values?: PropertiesParam;
  relations?: RelationsParam;
  types?: Array<Id>;
};

export type UpdateEntityParams = DefaultProperties & {
  id: Id;
  values?: PropertiesParam;
};

type RelationEntityParams = {
  [K in keyof EntityParams as `entity${Capitalize<string & K>}`]?: EntityParams[K];
};

export type RelationParams = {
  id?: Id;
  fromEntity: Id;
  toEntity: Id;
  relationId?: Id;
  toSpace?: Id;
  position?: string | undefined;
  type: Id; // relation type id
} & RelationEntityParams;

export type UpdateRelationParams = {
  id: Id;
  position?: string | undefined;
  verified?: boolean;
  fromSpace?: Id;
  fromVersion?: Id;
  toVersion?: Id;
  toSpace?: Id;
};

export type CreateResult = {
  id: Id;
  ops: Op[];
};

export type UnsetRelationParams = {
  id: Id;
  fromSpace?: boolean;
  fromVersion?: boolean;
  toSpace?: boolean;
  toVersion?: boolean;
  position?: boolean;
  verified?: boolean;
};

export type UnsetEntityValuesParams = {
  id: Id;
  properties: Id[];
};

export type DeleteRelationParams = {
  id: Id;
};

export type DeleteEntityParams = {
  id: Id;
};

export type CreateTypeParams = DefaultProperties & {
  properties?: Array<Id>;
};

export type CreatePropertyParams = DefaultProperties &
  ({ type: ValueType } | { type: 'RELATION'; properties?: Array<Id>; relationValueTypes?: Array<Id> });

export type CreateImageParams =
  | {
      blob: Blob;
      name?: string;
      description?: string;
      id?: Id;
    }
  | {
      url: string;
      name?: string;
      description?: string;
      id?: Id;
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

export type GraphUri = `graph://${string}`;

export enum VoteOption {
  None = 0,
  Abstain = 1,
  Yes = 2,
  No = 3,
}
