"use client";

export default function RecipesError({ reset }: { reset: () => void }) {
  return (
    <section className="flex min-h-[420px] w-full items-center justify-center text-center">
      <div className="max-w-md rounded-[28px] border border-line bg-card px-8 py-10 shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.05em] text-black">
          Recipes could not be loaded.
        </h1>
        <p className="mt-4 text-[15px] font-medium text-black">
          Try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-secondary"
        >
          Retry
        </button>
      </div>
    </section>
  );
}
