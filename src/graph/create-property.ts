import {PROPERTY, RELATION_VALUE_RELATIONSHIP_TYPE, SCHEMA_TYPE, TYPES_PROPERTY} from "../core/ids/system.js"
import {Id, assertValid, generate} from "../id.js"
import type {CreatePropertyParams, CreateResult, Op} from "../types.js"
import {createEntity} from "./create-entity.js"
import {createRelation} from "./create-relation.js"

/**
 * Creates a property with the given name, description, cover, and type.
 * All IDs passed to this function (cover, relation value types) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createProperty({
 *   name: 'name of the property',
 *   type: 'TEXT'
 *   description: 'description of the property',
 *   cover: imageEntityId,
 *   id: propertyId, // optional and will be generated if not provided
 * });
 * ```
 * @param params – {@link CreatePropertyParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an error if any provided ID is invalid
 */
export const createProperty = (params: CreatePropertyParams): CreateResult => {
	const {id, name, description, cover} = params
	if (id) {
		assertValid(id, "`id` in `createProperty`")
	}
	if (cover) assertValid(cover, "`cover` in `createProperty`")
	if (params.dataType === "RELATION") {
		for (const propertyId of params.properties ?? []) {
			assertValid(propertyId, "`properties` in `createProperty`")
		}
		for (const relationValueTypeId of params.relationValueTypes ?? []) {
			assertValid(relationValueTypeId, "`relationValueTypes` in `createProperty`")
		}
	}
	const entityId = id ?? generate()

	const ops: Array<Op> = []
	// add "Property" as "Types property"
	ops.push({
		type: "CREATE_PROPERTY",
		property: {
			id: Id(entityId),
			dataType: params.dataType,
		},
	})

	const {ops: entityOps} = createEntity({
		id: entityId,
		name,
		description,
		cover,
	})
	ops.push(...entityOps)

	// add "Property" as "Types property"
	ops.push({
		type: "CREATE_RELATION",
		relation: {
			id: generate(),
			entity: generate(),
			fromEntity: Id(entityId),
			toEntity: PROPERTY,
			type: TYPES_PROPERTY,
		},
	})

	if (params.dataType === "RELATION") {
		// add the provided properties to property "Properties"
		if (params.properties) {
			for (const propertyId of params.properties) {
				assertValid(propertyId)
				const {ops: relationOps} = createRelation({
					fromEntity: entityId,
					toEntity: propertyId,
					type: PROPERTY,
				})
				ops.push(...relationOps)
			}
		}
		if (params.relationValueTypes) {
			// add the provided relation value types to property "Relation Value Types"
			for (const relationValueTypeId of params.relationValueTypes) {
				assertValid(relationValueTypeId)
				const {ops: relationOps} = createRelation({
					fromEntity: entityId,
					toEntity: relationValueTypeId,
					type: RELATION_VALUE_RELATIONSHIP_TYPE,
				})
				ops.push(...relationOps)
			}
		}
	}

	return {id: Id(entityId), ops}
}
