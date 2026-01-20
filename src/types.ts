import type { SafeSmartAccountImplementation } from 'permissionless/accounts';
import type { SmartAccountClient } from 'permissionless/clients';
import type { Address, Chain, HttpTransport } from 'viem';
import type { SmartAccountImplementation } from 'viem/account-abstraction';
import type { Id } from './id.js';

export type ValueDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'TIME' | 'POINT';

export type DataType = ValueDataType | 'RELATION';

// New typed value types for GRC-20 v2 binary format
export type TypedValue =
  | { type: 'bool'; value: boolean }
  | { type: 'float64'; value: number; unit?: Id | string }
  | { type: 'text'; value: string; language?: Id | string }
  | { type: 'point'; lon: number; lat: number; alt?: number }
  | { type: 'date'; value: string }
  | { type: 'time'; value: string }
  | { type: 'datetime'; value: string }
  | { type: 'schedule'; value: string };

// Internal Value type used in ops (property + typed value)
// Flattened structure: property + TypedValue fields directly
export type Value = { property: Id } & TypedValue;

export type Entity = {
  id: Id;
  values: Array<Value>;
};

export type Relation = {
  id: Id;
  type: Id;
  fromEntity: Id;
  fromSpace?: Id;
  fromVersion?: Id;
  toEntity: Id;
  toSpace?: Id;
  toVersion?: Id;
  entity: Id;
  position?: string;
  verified?: boolean;
};

export type Property = {
  id: Id;
  dataType: DataType;
};

export type UpdateEntityOp = {
  type: 'UPDATE_ENTITY';
  entity: Entity;
};

export type CreatePropertyOp = {
  type: 'CREATE_PROPERTY';
  property: Property;
};

export type UnsetEntityValuesOp = {
  type: 'UNSET_ENTITY_VALUES';
  unsetEntityValues: {
    id: Id;
    properties: Id[];
  };
};

export type CreateRelationOp = {
  type: 'CREATE_RELATION';
  relation: Relation;
};

export type DeleteRelationOp = {
  type: 'DELETE_RELATION';
  id: Id;
};

export type UpdateRelationOp = {
  type: 'UPDATE_RELATION';
  relation: Pick<Relation, 'id' | 'position' | 'fromSpace' | 'toSpace' | 'fromVersion' | 'toVersion' | 'verified'>;
};

export type UnsetRelationFieldsOp = {
  type: 'UNSET_RELATION_FIELDS';
  unsetRelationFields: {
    id: Id;
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
  | CreateRelationOp
  | DeleteRelationOp
  | UpdateRelationOp
  | CreatePropertyOp
  | UnsetEntityValuesOp
  | UnsetRelationFieldsOp;

// ValueParams now directly accepts a TypedValue
export type ValueParams = {
  value: TypedValue;
};

export type DefaultProperties = {
  id?: Id | string;
  name?: string;
  description?: string;
  cover?: Id | string;
};

// Flattened structure: property + TypedValue fields directly
export type PropertyValueParam = { property: Id | string } & TypedValue;

export type PropertiesParam = Array<PropertyValueParam>;

export type EntityRelationParams = Omit<RelationParams, 'fromEntity' | 'type'>;

export type RelationsParam = Record<Id | string, EntityRelationParams | Array<EntityRelationParams>>;

export type EntityParams = DefaultProperties & {
  values?: PropertiesParam;
  relations?: RelationsParam;
  types?: Array<Id | string>;
};

export type UpdateEntityParams = Omit<DefaultProperties, 'cover'> & {
  id: Id | string;
  values?: PropertiesParam;
};

type RelationEntityParams = {
  [K in keyof EntityParams as `entity${Capitalize<string & K>}`]?: EntityParams[K];
};

export type RelationParams = {
  id?: Id | string;
  fromEntity: Id | string;
  toEntity: Id | string;
  toSpace?: Id | string;
  fromSpace?: Id | string;
  fromVersion?: Id | string;
  toVersion?: Id | string;
  verified?: boolean;
  position?: string | undefined;
  type: Id | string; // relation type id
} & RelationEntityParams;

export type UpdateRelationParams = {
  id: Id | string;
  position?: string | undefined;
  verified?: boolean;
  fromSpace?: Id | string;
  fromVersion?: Id | string;
  toVersion?: Id | string;
  toSpace?: Id | string;
};

export type CreateResult = {
  id: Id;
  ops: Op[];
};

export type CreateImageResult = CreateResult & {
  cid: string;
  dimensions?: { width: number; height: number };
};

export type UnsetRelationParams = {
  id: Id | string;
  fromSpace?: boolean;
  fromVersion?: boolean;
  toSpace?: boolean;
  toVersion?: boolean;
  position?: boolean;
  verified?: boolean;
};

export type UnsetEntityValuesParams = {
  id: Id | string;
  properties: Array<Id | string>;
};

export type DeleteRelationParams = {
  id: Id | string;
};

export type DeleteEntityParams = {
  id: Id | string;
};

export type CreateTypeParams = DefaultProperties & {
  properties?: Array<Id | string>;
};

export type CreatePropertyParams = DefaultProperties &
  (
    | { dataType: ValueDataType }
    | {
        dataType: 'RELATION';
        properties?: Array<Id | string>;
        relationValueTypes?: Array<Id | string>;
      }
  );

export type CreateImageParams =
  | {
      blob: Blob;
      name?: string;
      description?: string;
      id?: Id | string;
      network?: 'TESTNET' | 'TESTNET_V2' | 'MAINNET' | undefined;
    }
  | {
      url: string;
      name?: string;
      description?: string;
      id?: Id | string;
      network?: 'TESTNET' | 'TESTNET_V2' | 'MAINNET' | undefined;
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
