export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
} as const;

export const VERIFICATION_STATUS = {
  NONE: "NONE",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  VERIFIED: "VERIFIED",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];
export type VerificationStatus =
  (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

export type RBACProfile = {
  id?: string;
  role?: UserRole | null;
  account_status?: AccountStatus | null;
  verification_status?: VerificationStatus | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
} | null;

export const GUEST_LABEL = "GUEST" as const;
export type ActorKind =
  | typeof GUEST_LABEL
  | "PUBLIC_USER"
  | "ALUMNI_UNVERIFIED"
  | "ALUMNI_VERIFIED"
  | "ADMIN";