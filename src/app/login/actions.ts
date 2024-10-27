"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { serverClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await serverClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await serverClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const response = await supabase.auth.signUp(data);

  if (response.error) {
    redirect("/error");
  }

  console.log(response.data.user);
  if (response.data.user) {
    const res = await supabase.storage.createBucket(response.data.user.id);
    console.log(res);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
