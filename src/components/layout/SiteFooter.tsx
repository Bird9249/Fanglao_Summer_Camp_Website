import { Link } from '@tanstack/react-router'
import { RiCalendarFill, RiMapPinFill } from '@remixicon/react'
import { NavSectionLink } from './NavSectionLink'
import { mainNav, registerNav, siteMeta } from './nav'
import { SocialLinks } from './SocialLinks'
import { VientianeCenterMap } from './VientianeCenterMap'

export function SiteFooter() {
  return (
    <footer id="contact" className="footer-section scroll-mt-18 border-t border-primary/20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:py-16">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-primary md:text-3xl">
            ຕິດຕໍ່ & ເຂົ້າຮ່ວມ
          </h2>
          <p className="text-sm text-muted-foreground">
            Fanglao Studio · Vientiane Center 4F · ຕິດຕາມຂ່າວສານ ແລະລົງທະບຽນໄດ້ທຸກເວລາ
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <VientianeCenterMap />
          <SocialLinks />
        </div>

        <div className="grid gap-10 border-t border-border/60 pt-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3 lg:col-span-2">
            <p className="font-heading text-xl font-bold uppercase tracking-tight">
              {siteMeta.brand}
            </p>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {siteMeta.tagline}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">{siteMeta.slogan}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-wide">ເມນູ</p>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2">
              {mainNav.map((item) => (
                <NavSectionLink
                  key={item.sectionId}
                  sectionId={item.sectionId}
                  label={item.label}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeClassName="text-primary"
                />
              ))}
              {registerNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-wide">ກິດຈະກຳ</p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <RiCalendarFill className="mt-0.5 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Summer Camp</span>
                  <span>{siteMeta.campDates}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <RiCalendarFill className="mt-0.5 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">Fanglao Jam</span>
                  <span>{siteMeta.jamDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <RiMapPinFill className="mt-0.5 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <span>{siteMeta.campLocation}</span>
                  <span>{siteMeta.jamLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 Fanglao Studio. ຮຽນເຕັ້ນ ຮຽນວັດທະນະທຳ ສະແດງອອກ.</p>
          <p>Summer Dance Camp & Fanglao Jam — Vientiane, Laos</p>
        </div>
      </div>
    </footer>
  )
}
