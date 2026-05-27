// app/admin/page.tsx
// Password-gated admin panel — data entry for programmes + cut-off history

import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import ProgrammeTable from "@/components/features/admin/ProgrammeTable"
import { adminLogin, adminLogout, isAdminAuthenticated } from "./actions"

export const metadata: Metadata = {
  title: "Admin — AdmitGH",
  robots: { index: false, follow: false },
}

type PageProps = { searchParams: Promise<{ error?: string }> }

export default async function AdminPage({ searchParams }: PageProps) {
  const { error } = await searchParams
  const isAuth = await isAdminAuthenticated()

  if (!isAuth) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--card-bg)] px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--background)] p-8 shadow-sm">
            <h1 className="mb-1 text-xl font-bold">Admin Access</h1>
            <p className="mb-6 text-sm text-[var(--muted)]">AdmitGH data entry panel</p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
                Incorrect password — try again.
              </p>
            )}

            <form action={adminLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
              >
                Sign in
              </button>
            </form>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--card-bg)]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage programmes, institutions &amp; cut-off data
              </p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>

          <ProgrammeTable />
        </div>
      </main>
    </>
  )
}
