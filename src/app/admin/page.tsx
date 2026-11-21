import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminSupabaseClient } from "../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await getAdminSupabaseClient();

  if (!supabase) {
    redirect("/admin/login");
  }

  const [performancesResult, papersResult] = await Promise.all([
    supabase.from("performances").select("id", { count: "exact", head: true }),
    supabase.from("research_papers").select("id", { count: "exact", head: true }),
  ]);

  const countError = performancesResult.error || papersResult.error;

  return (
    <main className="min-h-screen bg-[#11100f] px-5 py-12 text-[#f2eee8] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 border-b border-[#393631] pb-6">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.24em] text-[#c5a77d]">
            Moh. Wail Irsyad · Admin
          </p>
          <h1 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-[#b7b0a7]">
            Your private portfolio management area. Record totals below are read from Supabase.
          </p>
        </header>

        {countError ? (
          <p
            role="status"
            className="border border-[#74594d] bg-[#211a17] p-4 font-sans text-sm leading-6 text-[#e8c2b6]"
          >
            The dashboard loaded, but record totals could not be retrieved. Check that the
            Supabase schema is applied and that this admin account has the required database
            policies.
          </p>
        ) : (
          <section aria-label="Portfolio record totals" className="grid gap-4 sm:grid-cols-2">
            <article className="border border-[#393631] bg-[#171615] p-6">
              <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-[#c5a77d]">
                Photos / Performances
              </h2>
              <p className="mt-5 font-serif text-5xl font-normal">
                {performancesResult.count ?? 0}
              </p>
              <p className="mt-2 font-sans text-sm text-[#b7b0a7]">Registered photo records</p>
            </article>

            <article className="border border-[#393631] bg-[#171615] p-6">
              <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-[#c5a77d]">
                Research Papers
              </h2>
              <p className="mt-5 font-serif text-5xl font-normal">
                {papersResult.count ?? 0}
              </p>
              <p className="mt-2 font-sans text-sm text-[#b7b0a7]">Registered paper records</p>
            </article>
          </section>
        )}

        <nav aria-label="Admin navigation" className="mt-10 flex flex-wrap gap-6 font-sans text-sm">
          <Link className="text-[#d9c4a5] underline decoration-[#75644d] underline-offset-4" href="/">
            View public website
          </Link>
          <Link
            className="text-[#d9c4a5] underline decoration-[#75644d] underline-offset-4"
            href="/admin/login"
          >
            Admin sign-in
          </Link>
        </nav>
      </div>
    </main>
  );
}
