export default function RecipesLoading() {
  return (
    <section className="w-full" aria-label="Loading recipes">
      <div className="grid max-w-[820px] grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="min-h-32 animate-pulse rounded-[22px] border border-line bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)]"
          >
            <div className="h-5 w-2/3 rounded-full bg-black/15" />
            <div className="mt-4 h-4 w-1/2 rounded-full bg-black/10" />
            <div className="mt-8 h-12 rounded-full bg-black/10" />
          </div>
        ))}
      </div>
    </section>
  );
}
