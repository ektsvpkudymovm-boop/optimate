import { assertSafeAdminRuntimeEnv } from "./lib/admin-env";

export async function register() {
  assertSafeAdminRuntimeEnv();
}
