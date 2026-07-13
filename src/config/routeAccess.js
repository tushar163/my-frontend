export const ROUTE_ACCESS = [
  { prefix: "/dashboard", roles: ["USER", "ADMIN", "SUPER_ADMIN"] },
  { prefix: "/agent", roles: ["AGENT", "ADMIN", "SUPER_ADMIN"] },
  { prefix: "/hotel-owner", roles: ["HOTEL_OWNER", "ADMIN", "SUPER_ADMIN"] },
  { prefix: "/admin", roles: ["ADMIN", "SUPER_ADMIN"] },
];

export const GUEST_ONLY_ROUTES = ["/login", "/register"];

export const ROLE_HOME = {
  USER: "/dashboard",
  AGENT: "/agent",
  HOTEL_OWNER: "/hotel-owner",
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
};

export function getRoleHome(role) {
  return ROLE_HOME[role] || "/dashboard";
}
