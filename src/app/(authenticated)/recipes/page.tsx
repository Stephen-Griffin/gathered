const recipes = [
  "Chicken Biryani",
  "Weeknight Ragù",
  "Herby Bean Soup",
  "Turkey Chili",
  "Crispy Rice Bowl",
  "Lemon Pasta",
];

export default function RecipesPage() {
  return (
    <section className="w-full">
      <div className="grid max-w-[820px] grid-cols-1 gap-5 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <article
            key={recipe}
            className="grid min-h-32 grid-cols-1 gap-5 rounded-[22px] border border-line bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:grid-cols-[1fr_132px] sm:items-center"
          >
            <div>
              <h1 className="text-[18px] font-bold tracking-[-0.04em] text-black">
                {recipe}
              </h1>
              <p className="mt-2 text-[13px] font-medium leading-5 text-black">
                Three to four servings
              </p>
            </div>
            <button className="h-12 rounded-full bg-accent px-4 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:-translate-y-0.5 hover:bg-secondary">
              Add to grocery list
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
