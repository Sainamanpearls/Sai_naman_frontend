// Supabase was removed from the project. This shim keeps any lingering imports compiling.
// Use the backend REST APIs instead (see frontend fetch calls to /api/*).
export * from '../types';
// Provide a minimal runtime stub for legacy imports that may expect a `supabase` export.
export const supabase = {} as any;
