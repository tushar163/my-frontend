import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";
const THEME_KEY = "theme";

export function setAuthToken(token) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function getAuthToken() {
  return Cookies.get(TOKEN_KEY) || null;
}

export function removeAuthToken() {
  Cookies.remove(TOKEN_KEY);
}

export function setUserRole(role) {
  Cookies.set(ROLE_KEY, role, {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export function getUserRole() {
  return Cookies.get(ROLE_KEY) || null;
}

export function removeUserRole() {
  Cookies.remove(ROLE_KEY);
}

export function getTheme() {
  return Cookies.get(THEME_KEY) || null;
}

export function setTheme(theme) {
  Cookies.set(THEME_KEY, theme, {
    expires: 365,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

const MODULE_KEY = "active_module";

export function getActiveModule() {
  return Cookies.get(MODULE_KEY) || "overview";
}

export function setActiveModule(module) {
  Cookies.set(MODULE_KEY, module, {
    expires: 365,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
