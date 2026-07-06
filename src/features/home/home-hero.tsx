const groceries = [
  "San Marzano tomatoes",
  "Fresh basil",
  "Rigatoni",
  "Ground turkey",
  "Parmesan",
];

export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-12 sm:px-7 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1fr_0.82fr] lg:gap-20 lg:py-0">
      <div className="max-w-[560px]">
        <h1 className="text-[clamp(3rem,8vw,6.6rem)] font-bold leading-[0.86] tracking-[-0.075em] text-black">
            Gather recipes, plans, and groceries all in one place.
        </h1>
        <p className="mt-7 max-w-[440px] text-[16px] font-medium leading-7 text-black">
          Gathered helps households collect favorite recipes, shape weekly menus, and turn plans into grocery lists without wasting a single ingredient.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-accent px-6 text-[13px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_18px_32px_rgba(53,34,8,0.24)] transition hover:-translate-y-0.5 hover:bg-secondary"
            href="/recipes"
          >
            Start gathering
          </a>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-[430px] rounded-[34px] border border-line bg-white p-4 shadow-[0_30px_90px_rgba(0,0,0,0.12)]">
        <div className="absolute -left-4 top-10 hidden h-24 w-8 rounded-l-2xl bg-secondary lg:block" />
        <div className="rounded-[26px] border border-line bg-card p-4">
          <div className="rounded-[20px] bg-white p-5 shadow-inner shadow-black/5">
            <div className="flex items-start justify-between gap-4 border-b border-card pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                  Prep ticket
                </p>
                <p className="mt-2 text-[22px] font-bold tracking-[-0.04em] text-black">
                  Thursday pasta
                </p>
              </div>
              <p className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-white">
                18 min
              </p>
            </div>
            <div className="mt-5 space-y-2.5">
              {groceries.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-line bg-card px-4 py-3 text-[13px] font-semibold text-black"
                >
                  <span>{item}</span>
                  <span className="size-2 rounded-full bg-accent" />
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-accent px-4 py-3 text-[12px] font-semibold leading-5 text-white">
              One recipe becomes one plan, then one list that is ready before
              anyone asks what&apos;s for dinner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
