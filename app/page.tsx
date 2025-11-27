"use client";

import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { postRequest } from "./api/request";
import { Link } from "react-router-dom";
import { MdKey, MdMail } from "react-icons/md";
import { useAuthStore } from "./contexts/UserContext";
import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormData {
  email: string;
  password: string;
}

interface IUSER {
  id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  token: any;
  message: string;
}

export default function Home() {
  const login = useAuthStore((state) => state.login);

  // ------------------------
  // FORM STATE (Email/Password)
  // ------------------------
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ------------------------
  // LOGIN MUTATION
  // ------------------------
  const { mutate, isPending, error, isError } = useMutation<IUSER>({
    mutationFn: async () => {
      return postRequest(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      login({
        id: data?.id,
        email: data?.email,
        role: data?.role,
        token: data.token,
      });

      setFormData({
        email: "",
        password: "",
      });
    },
  });

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required.");
      return;
    }
    mutate();
  };

  // ------------------------
  // TANSTACK FORM EXAMPLE (clean & working)
  // ------------------------
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});


const form = useForm({
  defaultValues: { email: "", password: "" },
  onSubmit: ({ value }) => {
    const parsed = loginSchema.safeParse(value);
    if (!parsed.success) return;
    console.log("Valid:", parsed.data);
  },
});
  const [showPassword, setShowPassword] = useState(false);

  return (
<div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
  <main className="w-full max-w-md bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-md flex flex-col items-center">
        <div className="flex flex-col items-center gap-6 text-center  ">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Admin Login
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Enter your details correctly to login.
          </p>
        </div>

        {/* ------------------------ */}
        {/* BUG FORM (TanStack Form) */}
        {/* ------------------------ */}
        <form
        className="max-w-md  w-full"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                      placeholder="alice@gmail.com"
                    />
                  </Field>
                  
                );
              }}
            />
    <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel>Password</FieldLabel>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="******"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black dark:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>

     

            <Button
            className="mt-4 flex h-12 w-full items-center justify-center gap-2  bg-foreground px-5 text-background transition-colors hover:bg-[#383838]  md:w-1/2 px-8"
            onClick={handleLogin}
            type="submit"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
       
      </main>
    </div>
  );
}
