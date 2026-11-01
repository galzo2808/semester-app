// Browser storage quota and persistence (protection from automatic eviction).
export interface StorageInfo {
  usage?: number;
  quota?: number;
  persisted: boolean;
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (!navigator.storage?.persist) return false;
  if (await navigator.storage.persisted()) return true;
  return navigator.storage.persist();
}

export async function getStorageInfo(): Promise<StorageInfo> {
  const est = navigator.storage?.estimate ? await navigator.storage.estimate() : {};
  const persisted = navigator.storage?.persisted ? await navigator.storage.persisted() : false;
  return { usage: est.usage, quota: est.quota, persisted };
}
