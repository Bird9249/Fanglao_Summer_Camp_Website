import { RiMapPinFill } from '@remixicon/react'
import { contactInfo } from '~/lib/contact'

const { map } = contactInfo
const embedBbox = `${map.lng - 0.004},${map.lat - 0.003},${map.lng + 0.004},${map.lat + 0.003}`
const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(embedBbox)}&layer=mapnik&marker=${map.lat}%2C${map.lng}`

export function VientianeCenterMap() {
  return (
    <div className="footer-map relative overflow-hidden rounded-2xl border border-primary/25">
      <div className="footer-map-frame relative aspect-[16/10] w-full min-h-[14rem] md:min-h-[16rem]">
        <iframe
          title="Vientiane Center — Fanglao Studio 4F"
          src={embedSrc}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div
          aria-hidden
          className="footer-map-tint pointer-events-none absolute inset-0"
        />
        <div className="footer-map-pin pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
          <span className="mb-1 rounded-lg border border-primary/40 bg-background/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary backdrop-blur-sm">
            {map.floor} · {map.studio}
          </span>
          <RiMapPinFill size={32} className="text-primary drop-shadow-lg" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-card/80 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <p className="font-heading text-sm font-bold uppercase">{map.name}</p>
          <p className="text-xs text-muted-foreground">
            {map.studio} · ຊັ້ນ {map.floor}
          </p>
        </div>
        <a
          href={map.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold uppercase tracking-wide text-primary transition-opacity hover:opacity-80"
        >
          ເປີດແຜນທີ່
        </a>
      </div>
    </div>
  )
}
