export const databaseConfig = {
  type: 'in-memory-persistence',
  autoSeed: true,
  snapshotIntervalMs: 60000,
  storageFile: '.attendance-db-store.json',
} as const;
