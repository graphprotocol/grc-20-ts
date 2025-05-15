import type { Id } from './idv2.js';

export type ValueType = 'TEXT' | 'NUMBER' | 'CHECKBOX' | 'URL' | 'TIME' | 'POINT';

export type ValueOptions = {
  format?: string;
  unit?: string;
};

export type Value = {
  propertyId: Id;
  value: string;
  options?: ValueOptions;
};

export type Entity = {
  id: Id;
  values: Array<Value>;
};

export type Relation = {
  id: Id;
  type: Id;
  fromEntity: Id;
  fromProperty?: Id;
  toEntity: Id;
  toSpace?: Id;
  entity: Id;
  index?: string;
};

export type CreateEntityOp = {
  type: 'CREATE_ENTITY';
  entity: Entity;
};

export type UpdateEntityOp = {
  type: 'UPDATE_ENTITY';
  entity: Entity;
};

export type UnsetPropertiesOp = {
  type: 'UNSET_PROPERTIES';
  entity: Id;
  properties: Id[];
};

export type DeleteEntityOp = {
  type: 'DELETE_ENTITY';
  entity: Pick<Entity, 'id'>;
};

export type CreateRelationOp = {
  type: 'CREATE_RELATION';
  relation: Relation;
};

export type DeleteRelationOp = {
  type: 'DELETE_RELATION';
  relation: Pick<Relation, 'id'>;
};

export type UpdateRelationOp = {
  type: 'UPDATE_RELATION';
  relation: Pick<Relation, 'id' | 'index' | 'toSpace' | 'fromProperty'>;
};

export type Op =
  | CreateEntityOp
  | UpdateEntityOp
  | DeleteEntityOp
  | CreateRelationOp
  | DeleteRelationOp
  | UpdateRelationOp
  | UnsetPropertiesOp;

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
  properties?: PropertiesParam;
  relations?: RelationsParam;
  types?: Array<Id>;
};

export type UpdateEntityParams = DefaultProperties & {
  id: Id;
  properties?: PropertiesParam;
};

type RelationEntityParams = {
  [K in keyof EntityParams as `entity${Capitalize<string & K>}`]?: EntityParams[K];
};

export type RelationParams = {
  id?: Id;
  fromEntity: Id;
  toEntity: Id;
  relationId?: Id;
  fromProperty?: Id;
  toSpace?: Id;
  position?: string | undefined;
  type: Id; // relation type id
} & RelationEntityParams;

export type UpdateRelationParams = {
  id: Id;
  position?: string | undefined;
  fromProperty?: Id;
  toSpace?: Id;
};

export type CreateResult = {
  id: Id;
  ops: Op[];
};
