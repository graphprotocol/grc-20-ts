import type { Id } from './idv2.js';

type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ValueType = 'TEXT' | 'NUMBER' | 'CHECKBOX' | 'URL' | 'TIME' | 'POINT';

export type ValueOptions = {
  format?: string;
  unit?: string;
};

export type Value = {
  propertyId: string;
  value: string;
  options?: ValueOptions;
};

export type Entity = {
  id: string;
  values: Array<Value>;
};

export type Relation = {
  id: string;
  type: string;
  fromEntity: string;
  fromProperty?: string;
  toEntity: string;
  toSpace?: string;
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
  entity: string;
  properties: string[];
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

export type ReorderRelationOp = {
  type: 'REORDER_RELATION';
  relation: Pick<Relation, 'id'>;
};

// export type MoveEntityOp = {
//   type: 'MOVE_ENTITY';
//   entity: Pick<Entity, 'id'>;
//   position: string;
// };

// export type MergeEntitiesOp = {
//   type: 'MERGE_ENTITIES';
//   entities: Pick<Entity, 'id'>[];
// };

// export type BranchEntityOp = {
//   type: 'BRANCH_ENTITY';
//   entity: Pick<Entity, 'id'>;
// };

export type Op =
  | CreateEntityOp
  | UpdateEntityOp
  | DeleteEntityOp
  | CreateRelationOp
  | DeleteRelationOp
  | ReorderRelationOp
  | UnsetPropertiesOp;
// | MoveEntityOp
// | MergeEntitiesOp
// | BranchEntityOp;

type ValueParams = {
  value: string;
};

type RelationParams = {
  to: Id;
  relationId?: Id;
  position?: string | undefined;
};

export type PropertiesParam = Record<string, ValueParams>;

export type RelationsParam = Record<string, RelationParams | Array<RelationParams>>;

export type DefaultProperties = {
  id?: Id;
  name?: string;
  description?: string;
  cover?: Id;
};

export type CreateResult = {
  id: Id;
  ops: Op[];
};
