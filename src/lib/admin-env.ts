const DEFAULT_DEV_ADMIN_EMAIL = "admin@optimatesite.ru";
const DEFAULT_DEV_ADMIN_PASSWORD = "admin123";
const MIN_PRODUCTION_ADMIN_PASSWORD_LENGTH = 12;

type AdminCredentials = {
  email: string;
  password: string;
};

function getTrimmedEnv(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function getAdminEmail(isProduction: boolean): string {
  const email = getTrimmedEnv("ADMIN_EMAIL");
  if (email) return email.toLowerCase();

  if (!isProduction) {
    const legacyEmail = getTrimmedEnv("ADMIN_SEED_EMAIL");
    if (legacyEmail) return legacyEmail.toLowerCase();
  }

  return "";
}

function getAdminPassword(isProduction: boolean): string {
  const password = process.env.ADMIN_PASSWORD;
  if (password !== undefined) return password;

  if (!isProduction) {
    return process.env.ADMIN_SEED_PASSWORD ?? "";
  }

  return "";
}

function isDefaultDevPassword(password: string): boolean {
  return password === DEFAULT_DEV_ADMIN_PASSWORD;
}

export function validateAdminEnv(): AdminCredentials {
  const isProduction = process.env.NODE_ENV === "production";
  const allowDevAdminPassword =
    process.env.ALLOW_DEV_ADMIN_PASSWORD === "true" && !isProduction;

  const envEmail = getAdminEmail(isProduction);
  const envPassword = getAdminPassword(isProduction);

  const email =
    envEmail || (allowDevAdminPassword ? DEFAULT_DEV_ADMIN_EMAIL : "");
  const password =
    envPassword || (allowDevAdminPassword ? DEFAULT_DEV_ADMIN_PASSWORD : "");

  if (!email) {
    throw new Error("ADMIN_EMAIL is required for admin initialization.");
  }

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required for admin initialization.");
  }

  if (isProduction && isDefaultDevPassword(password)) {
    throw new Error("ADMIN_PASSWORD must not use the default development password in production.");
  }

  if (!isProduction && isDefaultDevPassword(password) && !allowDevAdminPassword) {
    throw new Error(
      "Default admin password is allowed only in development with ALLOW_DEV_ADMIN_PASSWORD=true."
    );
  }

  if (
    isProduction &&
    password.length < MIN_PRODUCTION_ADMIN_PASSWORD_LENGTH
  ) {
    throw new Error(
      `ADMIN_PASSWORD must be at least ${MIN_PRODUCTION_ADMIN_PASSWORD_LENGTH} characters in production.`
    );
  }

  return { email, password };
}

export function assertSafeAdminRuntimeEnv(): void {
  if (process.env.NODE_ENV === "production") {
    validateAdminEnv();
  }
}
