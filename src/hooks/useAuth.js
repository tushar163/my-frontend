"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  login as loginThunk,
  register as registerThunk,
  logout as logoutThunk,
  clearError,
} from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, error } = useSelector(
    (state) => state.auth
  );

  const login = (credentials) => dispatch(loginThunk(credentials));
  const register = (userData) => dispatch(registerThunk(userData));
  const logout = () => dispatch(logoutThunk());
  const resetError = () => dispatch(clearError());

  return {
    user,
    isAuthenticated,
    status,
    error,
    login,
    register,
    logout,
    resetError,
  };
}
