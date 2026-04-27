import type { UserRole, VerificationStatus } from "./constants";

export function isAdmin(role?: UserRole | null) {
  return role === "ADMIN";
}

export function isVerified(status?: VerificationStatus | null) {
  return status === "VERIFIED";
}

export function canComment(isAuthed: boolean) {
  return isAuthed; // USER + VERIFIED sama-sama bisa comment/like
}

export function canCreateThread(role?: UserRole | null, status?: VerificationStatus | null) {
  return role === "ADMIN" || status === "VERIFIED";
}