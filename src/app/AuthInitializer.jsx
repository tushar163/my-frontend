"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { getAuthToken } from "@/lib/cookies";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (getAuthToken() && status === "idle") {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, status]);

  return children;
}
