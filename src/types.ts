import type { SafeSmartAccountImplementation } from 'permissionless/accounts';
import type { SmartAccountClient } from 'permissionless/clients';
import type { Address, Chain, HttpTransport } from 'viem';
import type { SmartAccountImplementation } from 'viem/account-abstraction';
import type { Id } from './id.js';

export type ValueDataType = 'TEXT' | 'NUMBER' | 'CHECKBOX' | 'TIME' | 'POINT';

export type DataType = ValueDataType | 'RELATION';

export type ValueOptions = {
  text?: { language?: string | Id };
  number?: { unit?: string | Id };
};

export type Value = {
  property: Id;
  value: string;
  options?: ValueOptions | undefined;
};

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

export type ValueOptionsParams =
  | { type: 'number'; unit?: string | Id | undefined }
  | { type: 'text'; language?: string | Id | undefined };

export type ValueParams = {
  value: string;
  options?: ValueOptionsParams | undefined;
};

export type DefaultProperties = {
  id?: Id | string;
  name?: string;
  description?: string;
  cover?: Id | string;
};

export type PropertiesParam = Array<{ property: Id | string } & ValueParams>;

export type EntityRelationParams = Omit<RelationParams, 'fromEntity' | 'type'>;

export type RelationsParam = Record<Id | string, EntityRelationParams | Array<EntityRelationParams>>;

export type EntityParams = DefaultProperties & {
  values?: PropertiesParam;
  relations?: RelationsParam;
  types?: Array<Id | string>;
};

export type UpdateEntityParams = DefaultProperties & {
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
    | { dataType: 'RELATION'; properties?: Array<Id | string>; relationValueTypes?: Array<Id | string> }
  );

export type CreateImageParams =
  | {
      blob: Blob;
      name?: string;
      description?: string;
      id?: Id | string;
    }
  | {
      url: string;
      name?: string;
      description?: string;
      id?: Id | string;
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
