import { cn } from '~/lib/utils'

function BracketNode({
  x,
  y,
  label,
  active,
}: {
  x: number
  y: number
  label: string
  active?: boolean
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={0}
        y={0}
        width={88}
        height={32}
        rx={6}
        className={cn('bracket-node', active && 'bracket-node--active')}
      />
      <text
        x={44}
        y={20}
        textAnchor="middle"
        className="bracket-node-label"
      >
        {label}
      </text>
    </g>
  )
}

function BracketConnector({
  d,
  delay,
  active,
}: {
  d: string
  delay: string
  active: boolean
}) {
  return (
    <path
      d={d}
      className={cn('bracket-connector', active && 'bracket-connector--active')}
      style={{ animationDelay: delay }}
    />
  )
}

export function BracketPreview({ active }: { active: boolean }) {
  return (
    <div className="bracket-preview overflow-hidden rounded-2xl border border-primary/25 bg-background/50 p-4 md:p-6">
      <p className="mb-4 text-center font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Tournament Bracket Preview
      </p>

      <svg
        viewBox="0 0 640 280"
        aria-hidden
        className="mx-auto w-full max-w-3xl"
      >
        <defs>
          <linearGradient id="bracket-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.88 0.195 92)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="oklch(0.88 0.195 92)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.88 0.195 92)" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Left mini-bracket — Qualifiers */}
        <text x={118} y={18} textAnchor="middle" className="bracket-zone-label">
          QUALIFIERS
        </text>
        <BracketNode x={74} y={36} label="RD 1" active={active} />
        <BracketNode x={74} y={96} label="RD 1" active={active} />
        <BracketNode x={74} y={156} label="RD 1" active={active} />
        <BracketNode x={74} y={216} label="RD 1" active={active} />
        <BracketNode x={196} y={66} label="SEMI" active={active} />
        <BracketNode x={196} y={186} label="SEMI" active={active} />
        <BracketNode x={318} y={126} label="FINAL" active={active} />

        <BracketConnector
          d="M 162 52 L 196 82"
          delay="0s"
          active={active}
        />
        <BracketConnector
          d="M 162 112 L 196 82"
          delay="0.2s"
          active={active}
        />
        <BracketConnector
          d="M 162 172 L 196 202"
          delay="0.4s"
          active={active}
        />
        <BracketConnector
          d="M 162 232 L 196 202"
          delay="0.6s"
          active={active}
        />
        <BracketConnector
          d="M 284 82 L 318 142"
          delay="0.8s"
          active={active}
        />
        <BracketConnector
          d="M 284 202 L 318 142"
          delay="1s"
          active={active}
        />

        {/* Right mini-bracket — Battles */}
        <text x={522} y={18} textAnchor="middle" className="bracket-zone-label">
          BATTLES
        </text>
        <BracketNode x={478} y={66} label="2vs2" active={active} />
        <BracketNode x={478} y={186} label="KIDS" active={active} />
        <BracketNode x={356} y={126} label="SHOW" active={active} />

        <BracketConnector
          d="M 478 82 L 444 142"
          delay="0.3s"
          active={active}
        />
        <BracketConnector
          d="M 478 202 L 444 142"
          delay="0.5s"
          active={active}
        />

        {/* Center arena pulse */}
        <circle
          cx={320}
          cy={140}
          r={46}
          className={cn('bracket-arena', active && 'bracket-arena--active')}
        />
        <text x={320} y={136} textAnchor="middle" className="bracket-arena-label">
          JAM
        </text>
        <text x={320} y={154} textAnchor="middle" className="bracket-arena-sub">
          18 JUL
        </text>
      </svg>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Lao National Circus · Vientiane
      </p>
    </div>
  )
}
