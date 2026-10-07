export const metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function AdminLoginPage({
  searchParams
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next = searchParams.next || "/admin";

  return (
    <section className="mx-auto max-w-sm py-20">
      <h1 className="font-serif text-2xl text-ink">Admin login</h1>
      {searchParams.error && (
        <p className="mt-3 rounded-lg bg-crime/10 px-3 py-2 text-sm text-crime">
          Wrong password.
        </p>
      )}
      <form action="/api/admin/login" method="post" className="mt-6 space-y-3">
        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          className="w-full rounded-full border border-line bg-card px-4 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
        >
          Sign in
        </button>
      </form>
    </section>
  );
}
