import { contactInfo, socialLinks } from '~/lib/contact'
import { RiMailLine } from '@remixicon/react'
import { cn } from '~/lib/utils'

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="footer-social-btn group flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-card text-primary transition-all hover:border-primary/60 hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 md:size-16"
            >
              <Icon size={28} className="transition-transform group-hover:scale-110" />
            </a>
          )
        })}
      </div>

      <a
        href={`mailto:${contactInfo.email}`}
        className="footer-email flex items-center gap-3 rounded-2xl border border-border/70 bg-background/50 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-background/80"
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <RiMailLine size={22} />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Email
          </span>
          <span className="truncate text-sm font-medium text-foreground md:text-base">
            {contactInfo.email}
          </span>
        </div>
      </a>
    </div>
  )
}
