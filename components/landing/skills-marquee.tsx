const skills = [
  'React',
  'TypeScript',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'Docker',
  'Kubernetes',
  'AWS',
  'Machine Learning',
  'GraphQL',
  'Product Strategy',
  'Data Analysis',
  'Figma',
  'Go',
  'CI/CD',
  'Leadership',
]

export function SkillsMarquee() {
  return (
    <section aria-label="Skills our AI detects" className="border-y border-border bg-card/30 py-6">
      <p className="mb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Detects thousands of skills and keywords
      </p>
      <div className="mask-fade-x flex overflow-hidden">
        <div className="flex w-max animate-marquee gap-3 pr-3">
          {[...skills, ...skills].map((s, i) => (
            <span
              key={i}
              aria-hidden={i >= skills.length}
              className="rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm whitespace-nowrap text-foreground/80"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
