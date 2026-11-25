export const LOCAL_ID_START = 1_000_000;

export const isLocalId = (id: number) => id >= LOCAL_ID_START;

export function parseProductId(raw: string): number | null {
  if (!/^\d{1,9}$/.test(raw)) return null;
  const id = Number(raw);
  return id > 0 ? id : null;
}
