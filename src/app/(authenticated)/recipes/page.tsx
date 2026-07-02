export default function RecipesPage() {
  return (
    <section className="w-full rounded-[2rem] border border-amber-900/10 bg-card/80 p-8 shadow-xl shadow-amber-900/5">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
        Recipes
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Recipe library</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        Save household favorites, capture prep notes, and organize recipes for
        upcoming meal plans.
      </p>
    </section>
  );
}
