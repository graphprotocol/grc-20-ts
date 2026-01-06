const UUID_DASHLESS_REGEX = /^[0-9a-fA-F]{32}$/;

/**
 * If `id` looks like a UUID without dashes (32 hex chars), convert it to the
 * dashed UUID format. Otherwise returns `null`.
 */
export function dashlessUuidToDashed(id: string): string | null {
  if (!UUID_DASHLESS_REGEX.test(id)) return null;
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}

/**
 * `uuid.parse` accepts the dashed UUID format, so normalize canonical (dashless)
 * UUIDs into the dashed representation, leaving other inputs unchanged.
 */
export function normalizeUuidForParse(id: string): string {
  return dashlessUuidToDashed(id) ?? id;
}
