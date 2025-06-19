import type {Op} from "../types.js"
import {MAINNET_API_ORIGIN, TESTNET_API_ORIGIN} from "./constants.js"

type Params = {
	editorAddress: string
	name: string
	network?: "TESTNET" | "MAINNET"
	spaceType?: "PUBLIC" | "PERSONAL"
	ops?: Op[]
	spaceEntityId?: string
}

/**
 * Creates a space with the given name and editor address.
 */
export const createSpace = async (params: Params) => {
	const apiHost = params.network === "TESTNET" ? TESTNET_API_ORIGIN : MAINNET_API_ORIGIN
	console.log("apiHost", apiHost)

	const formData = new FormData()
	formData.append("name", params.name)
	formData.append("editorAddress", params.editorAddress)
	if (params.spaceEntityId) {
		formData.append("spaceEntityId", params.spaceEntityId)
	}

	if (params.ops) {
		formData.append("ops", JSON.stringify(params.ops))
	}

	const result = await fetch(`${apiHost}/deploy`, {
		method: "POST",
		body: JSON.stringify({
			spaceName: params.name,
			initialEditorAddress: params.editorAddress,
			ops: params.ops,
			spaceEntityId: params.spaceEntityId,
			spaceType: params.spaceType,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	})

	const jsonResult = await result.json()
	return {id: jsonResult.spaceId}
}
