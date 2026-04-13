type PageIntroProps = {
  title: string;
  description: string;
};

export function PageIntro({ title, description }: PageIntroProps) {
  return (
    <header className="space-y-3 rounded-2xl border border-foreground/8 bg-foreground/[0.02] p-5 shadow-sm sm:p-6">
      <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="max-w-3xl text-pretty text-base leading-relaxed text-foreground/65 sm:text-lg">
        {description}
      </p>
    </header>
  );
}
