import type { SafeSmartAccountImplementation } from 'permissionless/accounts';
import type { SmartAccountClient } from 'permissionless/clients';
import type { Address, Chain, HttpTransport } from 'viem';
import type { SmartAccountImplementation } from 'viem/account-abstraction';
import type { Id } from './id.js';

export type ValueDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'TIME' | 'POINT';

export type DataType = ValueDataType | 'RELATION';

/**
 * Typed value types for GRC-20 v2 binary format.
 *
 * Date/time formats:
 * - `date`: ISO 8601 date format (YYYY-MM-DD), e.g., "2024-01-15"
 * - `time`: ISO 8601 time format with timezone (HH:MM:SSZ or HH:MM:SS+HH:MM), e.g., "14:30:00Z"
 * - `datetime`: ISO 8601 combined date and time with timezone, e.g., "2024-01-15T14:30:00Z"
 * - `schedule`: iCalendar RRULE format for recurring events, e.g., "FREQ=WEEKLY;BYDAY=MO,WE,FR"
 */
export type TypedValue =
  | { type: 'bool'; value: boolean }
  | { type: 'float64'; value: number; unit?: Id | string }
  | { type: 'text'; value: string; language?: Id | string }
  | { type: 'point'; lon: number; lat: number; alt?: number }
  /** ISO 8601 date format (YYYY-MM-DD), e.g., "2024-01-15" */
  | { type: 'date'; value: string }
  /** ISO 8601 time format with timezone (HH:MM:SSZ or HH:MM:SS+HH:MM), e.g., "14:30:00Z" */
  | { type: 'time'; value: string }
  /** ISO 8601 combined date and time, e.g., "2024-01-15T14:30:00Z" */
  | { type: 'datetime'; value: string }
  /** iCalendar RRULE format for recurring events, e.g., "FREQ=WEEKLY;BYDAY=MO,WE,FR" */
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
  relation: Pick<Relation, 'id' | 'position' | 'fromSpace' | 'toSpace' | 'fromVersion' | 'toVersion'>;
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
  position?: string | undefined;
  type: Id | string; // relation type id
} & RelationEntityParams;

export type UpdateRelationParams = {
  id: Id | string;
  position?: string | undefined;
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
      network?: 'TESTNET' | 'TESTNET_V2' | 'TESTNET_V3' | 'MAINNET' | undefined;
    }
  | {
      url: string;
      name?: string;
      description?: string;
      id?: Id | string;
      network?: 'TESTNET' | 'TESTNET_V2' | 'TESTNET_V3' | 'MAINNET' | undefined;
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
