import {
  ACCOUNT_STATUS,
  GUEST_LABEL,
  RBACProfile,
  USER_ROLE,
  VERIFICATION_STATUS,
  type ActorKind,
} from "./constants";

export function isLoggedIn(profile: RBACProfile) {
  return Boolean(profile?.id);
}

export function isAdmin(profile: RBACProfile) {
  return profile?.role === USER_ROLE.ADMIN;
}

export function isActiveAccount(profile: RBACProfile) {
  if (!profile) return false;
  return profile.account_status === ACCOUNT_STATUS.ACTIVE;
}

export function isVerified(profile: RBACProfile) {
  return profile?.verification_status === VERIFICATION_STATUS.VERIFIED;
}

export function isUnverified(profile: RBACProfile) {
  if (!profile) return false;

  return (
    profile.verification_status === VERIFICATION_STATUS.PENDING ||
    profile.verification_status === VERIFICATION_STATUS.REJECTED
  );
}

export function isPublicUser(profile: RBACProfile) {
  if (!profile) return false;
  if (isAdmin(profile)) return false;

  return profile.verification_status === VERIFICATION_STATUS.NONE;
}

export function getActorKind(profile: RBACProfile): ActorKind {
  if (!profile?.id) return GUEST_LABEL;
  if (isAdmin(profile)) return "ADMIN";
  if (isVerified(profile)) return "ALUMNI_VERIFIED";
  if (isUnverified(profile)) return "ALUMNI_UNVERIFIED";
  return "PUBLIC_USER";
}

export function canAccessAlumniHub(profile: RBACProfile) {
  return isAdmin(profile) || isVerified(profile);
}

export function canAccessAdmin(profile: RBACProfile) {
  return isAdmin(profile);
}

export function canComment(profile: RBACProfile) {
  if (!profile) return false;
  if (!isActiveAccount(profile)) return false;

  const actor = getActorKind(profile);
  return (
    actor === "PUBLIC_USER" ||
    actor === "ALUMNI_UNVERIFIED" ||
    actor === "ALUMNI_VERIFIED" ||
    actor === "ADMIN"
  );
}

export function canLike(profile: RBACProfile) {
  return canComment(profile);
}

export function canCreateThread(profile: RBACProfile) {
  if (!profile) return false;
  if (!isActiveAccount(profile)) return false;

  const actor = getActorKind(profile);
  return actor === "ALUMNI_VERIFIED" || actor === "ADMIN";
}

export function canCreateEvent(profile: RBACProfile) {
  return canCreateThread(profile);
}

export function canUploadResource(profile: RBACProfile) {
  return canCreateThread(profile);
}

export function canCreatePost(profile: RBACProfile) {
  return canCreateThread(profile);
}

export function canSubmitVerification(profile: RBACProfile) {
  if (!profile) return false;
  if (!isActiveAccount(profile)) return false;
  if (isAdmin(profile)) return false;
  if (isVerified(profile)) return false;

  return (
    profile.verification_status === VERIFICATION_STATUS.NONE ||
    profile.verification_status === VERIFICATION_STATUS.REJECTED
  );
}

export function canViewVerificationStatus(profile: RBACProfile) {
  if (!profile) return false;
  if (!isActiveAccount(profile)) return false;
  if (isAdmin(profile)) return false;

  return true;
}

export function getForumCTA(profile: RBACProfile) {
  const actor = getActorKind(profile);

  if (actor === GUEST_LABEL) {
    return {
      message: "Login untuk komentar / like",
      href: "/login",
    };
  }

  if (actor === "PUBLIC_USER" || actor === "ALUMNI_UNVERIFIED") {
    return {
      message: "Gabung sebagai Alumni (Verifikasi)",
      href: "/verify-alumni",
    };
  }

  return null;
}