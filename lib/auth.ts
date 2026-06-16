import { signIn, signOut } from "next-auth/react";

export async function loginWithGithub() {
  await signIn("github", { redirectTo: "/" });
}

export async function logout() {
  await signOut({ redirectTo: "/auth/signin" });
}
