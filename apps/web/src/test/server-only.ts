// Vitest runs in Node outside Next.js' conditional export map. This no-op
// preserves the production server-only boundary while allowing repository
// integration tests to import the same module graph.
export {};
