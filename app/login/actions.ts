"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Return error message instead of redirecting
    return {
      error: error.message,
    };
  }

  // Return success instead of redirecting
  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // Return error message instead of redirecting
    return {
      error: error.message,
    };
  }

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/update`,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const code = formData.get("code") as string;
  console.log(code);

  if (!code) {
    return {
      error: "Invalid password reset code",
    };
  }

  const { error } = await supabase.auth.updateUser(
    {
      password: password,
    },
    {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
    }
  );

  if (error) {
    return {
      error: error.message,
    };
  }

  return { success: true };
}
