"use client";

import { Description, FieldError, Input, Label, ListBox, Select, TextField } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getRoleHome } from "@/config/routeAccess";

const ROLES = [
  { id: "USER", name: "User" },
  { id: "AGENT", name: "Agent" },
  { id: "HOTEL_OWNER", name: "Hotel Owner" },
];

function validateField(name, value) {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      return "";
    case "phone":
      if (value && !/^\+?[\d\s-]{7,15}$/.test(value))
        return "Invalid phone number";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return "";
    case "role":
      if (!value) return "Role is required";
      return "";
    default:
      return "";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, register, isAuthenticated, status, error, resetError } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

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
    const fields = ["name", "email", "password", "role"];
    const newErrors = {};
    let hasError = false;
    for (const f of fields) {
      const err = validateField(f, form[f]);
      newErrors[f] = err;
      if (err) hasError = true;
    }
    const phoneErr = validateField("phone", form.phone);
    newErrors.phone = phoneErr;
    setErrors(newErrors);
    if (hasError || phoneErr) return;

    const payload = { name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role };
    if (form.phone.trim()) payload.phone = form.phone.trim();
    register(payload);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-border bg-surface-raised p-6 shadow-card"
      >
        <h1 className="text-2xl font-display font-semibold text-ink">Create Account</h1>

        <TextField
          isRequired
          isInvalid={!!errors.name}
          name="name"
          value={form.name}
          onChange={handleChange("name")}
        >
          <Label>Full Name</Label>
          <Input placeholder="John Doe" />
          {errors.name && <FieldError>{errors.name}</FieldError>}
        </TextField>

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
          isInvalid={!!errors.phone}
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange("phone")}
        >
          <Label>Phone (optional)</Label>
          <Input placeholder="+1 (555) 000-0000" />
          {errors.phone ? (
            <FieldError>{errors.phone}</FieldError>
          ) : (
            <Description>Optional</Description>
          )}
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

        <Select
          isRequired
          isInvalid={!!errors.role}
          placeholder="Select role"
          value={form.role}
          onChange={(key) => handleChange("role")(key)}
        >
          <Label>Role</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {ROLES.map((role) => (
                <ListBox.Item key={role.id} id={role.id} textValue={role.name}>
                  {role.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
          {errors.role && <FieldError>{errors.role}</FieldError>}
        </Select>

        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-ink-inverse transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-ink-secondary">
          Already have an account?{" "}
          <a href="/login" className="text-brand-gold underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
