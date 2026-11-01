// In-memory IndexedDB for tests, and the build-time version constant.
import 'fake-indexeddb/auto';
(globalThis as Record<string, unknown>).__APP_VERSION__ = 'test';
