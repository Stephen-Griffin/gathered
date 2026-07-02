const highlights = [
  "Recipe library",
  "Shared meal plans",
  "Instacart-ready lists",
];

export function HomeHero() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
          Meal planning for busy households
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Gather recipes, plans, and groceries in one calm place.
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Gathered helps households collect favorite recipes, shape weekly
          menus, and turn plans into grocery lists without the kitchen-table
          scramble.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            className="rounded-full bg-foreground px-6 py-3 text-center text-sm font-semibold text-background shadow-lg shadow-amber-900/10 transition hover:-translate-y-0.5"
            href="#getting-started"
          >
            Start planning
          </a>
          <a
            className="rounded-full border border-foreground/15 bg-white/50 px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-foreground/30 hover:bg-white"
            href="/recipes"
          >
            Browse recipes
          </a>
        </div>
      </div>
      <div
        id="getting-started"
        className="rounded-[2rem] border border-amber-900/10 bg-card/80 p-6 shadow-2xl shadow-amber-900/10 backdrop-blur"
      >
        <p className="text-sm font-semibold text-muted">Foundation ready</p>
        <div className="mt-6 space-y-4">
          {highlights.map((highlight, index) => (
            <div
              key={highlight}
              className="flex items-center gap-4 rounded-2xl bg-amber-50 px-4 py-4"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="font-semibold">{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
