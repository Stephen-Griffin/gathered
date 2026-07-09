import Link from "next/link";
import {
  shoppingIntegrationProviders,
  shoppingIntegrationSummary,
} from "@/features/grocery/shopping-integration-settings";

export default function SettingsPage() {
  return (
    <section className="w-full max-w-[920px]">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
            Preferences
          </p>
          <h1 className="mt-2 text-[34px] font-bold leading-none tracking-[-0.06em] text-black sm:text-[44px]">
            Settings
          </h1>
          <p className="mt-4 max-w-[620px] text-[15px] font-medium leading-6 text-black/70">
            Manage account preferences and upcoming shopping integrations for
            your grocery list.
          </p>
        </div>
        <Link
          href="/grocery-list"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-line bg-card px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:-translate-y-0.5 hover:bg-white"
        >
          Grocery list
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[28px] border border-line bg-card p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-accent">
                Integrations
              </p>
              <h2 className="mt-2 text-[24px] font-bold tracking-[-0.05em] text-black">
                Shopping providers
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-black/65">
              Coming soon
            </span>
          </div>

          <p className="mt-4 max-w-[660px] text-[14px] font-medium leading-6 text-black/70">
            {shoppingIntegrationSummary.defaults}
          </p>
          <p className="mt-2 max-w-[660px] text-[14px] font-medium leading-6 text-black/70">
            {shoppingIntegrationSummary.linkGeneration} Gathered will send you
            to provider product or search links, then checkout stays on the
            retailer site.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {shoppingIntegrationProviders.map((provider) => (
              <article
                key={provider.id}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[20px] font-bold tracking-[-0.05em] text-black">
                    {provider.name}
                  </h3>
                  <span className="rounded-full bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-black/60">
                    {provider.status}
                  </span>
                </div>
                <dl className="mt-5 grid gap-4">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/45">
                      Default use
                    </dt>
                    <dd className="mt-1 text-[14px] font-semibold leading-5 text-black">
                      {provider.defaultFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/45">
                      Link support
                    </dt>
                    <dd className="mt-1 text-[13px] font-medium leading-5 text-black/70">
                      {provider.comingSoon}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-line bg-card p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] sm:p-7">
          <h2 className="text-[22px] font-bold tracking-[-0.05em] text-black">
            Checkout stays manual
          </h2>
          <p className="mt-3 text-[13px] font-medium leading-5 text-black/70">
            {shoppingIntegrationSummary.checkout}
          </p>
          <p className="mt-4 text-[13px] font-medium leading-5 text-black/70">
            Gathered will not connect retailer accounts, create carts, or
            automate checkout in this placeholder flow.
          </p>
        </aside>
      </div>
    </section>
  );
}
