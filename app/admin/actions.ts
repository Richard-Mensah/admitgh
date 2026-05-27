"use server"
// app/admin/actions.ts
// Server actions for simple password-based admin auth

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admitgh-admin-2026"
const COOKIE_NAME = "admitgh_admin"
const COOKIE_VALUE = "authenticated"

export async function adminLogin(formData: FormData) {
  const password = formData.get("password") as string
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
    })
    redirect("/admin")
  }
  redirect("/admin?error=1")
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect("/admin")
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE
}
