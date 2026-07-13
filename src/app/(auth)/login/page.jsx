"use client";

import { FieldError, Input, Label, TextField } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getRoleHome } from "@/config/routeAccess";

function validateField(name, value) {
  switch (name) {
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    default:
      return "";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, isAuthenticated, status, error, resetError } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const redirectTo = useCallback(() => {
    const redirect = searchParams.get("redirect");
    const home = user ? getRoleHome(user.role) : "/dashboard";
    router.push(redirect || home);
  }, [searchParams, user, router]);

  useEffect(() => {
    if (isAuthenticated) redirectTo();
  }, [isAuthenticated, redirectTo]);

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const fieldErr = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: fieldErr }));
    if (error) resetError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailErr = validateField("email", form.email);
    const passErr = validateField("password", form.password);
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;
    login(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-surface-raised p-6 shadow-card"
      >
        <h1 className="text-2xl font-display font-semibold text-ink">Sign In</h1>

        <TextField
          isRequired
          isInvalid={!!errors.email}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
        >
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </TextField>

        <TextField
          isRequired
          isInvalid={!!errors.password}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
        >
          <Label>Password</Label>
          <Input placeholder="••••••••" />
          {errors.password && <FieldError>{errors.password}</FieldError>}
        </TextField>

        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-ink-inverse transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-ink-secondary">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-brand-gold underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
