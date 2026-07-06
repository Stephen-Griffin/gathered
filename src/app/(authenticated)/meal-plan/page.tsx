export default function MealPlanPage() {
  return (
    <section className="flex min-h-[420px] w-full items-center justify-center text-center">
      <div className="max-w-md rounded-[28px] border border-line bg-card px-8 py-10 shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.05em] text-black">
          It seems like you haven&apos;t made a meal plan yet.
        </h1>
        <p className="mt-4 text-[15px] font-medium text-black">
          Let&apos;s plan dinner.
        </p>
        <a
          href="/recipes"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#75776b] px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#686a60]"
        >
          Make a plan
        </a>
      </div>
    </section>
  );
}
