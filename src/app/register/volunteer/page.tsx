"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function VolunteerRegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await signUp(data.email, data.password, "volunteer", { name: data.name });
      router.push("/dashboard/volunteer");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed. Please try again.");
    }
  };

  return (
    <AppLayout showAuth={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold text-center">Register as Volunteer</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[var(--error-bg)] text-[var(--error)] text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input {...register("name")} placeholder="Your name" />
              {errors.name && (
                <p className="text-sm text-[var(--error)] mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input {...register("email")} type="email" placeholder="you@example.com" />
              {errors.email && (
                <p className="text-sm text-[var(--error)] mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input {...register("password")} type="password" placeholder="••••••••" />
              {errors.password && (
                <p className="text-sm text-[var(--error)] mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>
          </form>
          <p className="text-center text-sm text-[var(--foreground-secondary)]">
            <Link href="/register" className="text-[var(--accent)] hover:underline">
              ← Back
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
