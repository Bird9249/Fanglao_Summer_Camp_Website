import { cn } from '~/lib/utils'

const sloganLines = [
  { lead: 'LEARN THE ', accent: 'DANCE.', tier: 'lead' as const },
  { lead: 'UNDERSTAND THE ', accent: 'CULTURE.', tier: 'mid' as const },
  { lead: '', accent: 'EXPRESS YOURSELF.', tier: 'punch' as const },
]

const revealBaseDelay = 280

export function HeroTextReveal() {
  return (
    <div className="w-full max-w-4xl">
      {/* <p
        className="hero-slogan-eyebrow hero-reveal-line mb-4 w-full font-heading text-[0.65rem] font-bold uppercase tracking-[0.35em] text-primary sm:mb-5 sm:text-xs"
        style={{ animationDelay: '120ms' }}
      >
        {siteMeta.tagline}
      </p> */}

      <h1 className="flex flex-col items-center gap-1.5 text-center font-heading font-black uppercase leading-[1.08] md:gap-2">
        {sloganLines.map((line, index) => (
          <span
            key={line.accent}
            className={cn(
              'hero-reveal-line hero-slogan-line block',
              line.tier === 'lead' && 'hero-slogan-line--lead',
              line.tier === 'mid' && 'hero-slogan-line--mid',
              line.tier === 'punch' && 'hero-slogan-line--punch',
            )}
            style={{
              animationDelay: `${revealBaseDelay + index * 300}ms`,
            }}
          >
            {line.lead ? (
              <span className="hero-slogan-lead">{line.lead}</span>
            ) : null}
            {line.tier === 'punch' ? (
              <span className="hero-slogan-punch-wrap">
                <span
                  className="hero-slogan-punch hero-slogan-accent--glow"
                  style={{
                    animationDelay: `${revealBaseDelay + index * 300 + 400}ms`,
                  }}
                >
                  {line.accent}
                </span>
                <span
                  aria-hidden
                  className="hero-slogan-rule"
                  style={{
                    animationDelay: `${revealBaseDelay + index * 300 + 650}ms`,
                  }}
                />
              </span>
            ) : (
              <span
                className="hero-slogan-accent hero-slogan-accent--glow"
                style={{
                  animationDelay: `${revealBaseDelay + index * 300 + 350}ms`,
                }}
              >
                {line.accent}
              </span>
            )}
          </span>
        ))}
      </h1>
    </div>
  )
}
