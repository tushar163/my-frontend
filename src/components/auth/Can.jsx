"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Can({ roles = [], fallback = null, children }) {
  const { user } = useAuth();
  if (!user) return fallback;
  if (!roles.includes(user.role)) return fallback;
  return children;
}
