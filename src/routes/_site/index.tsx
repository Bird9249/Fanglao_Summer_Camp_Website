import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '~/components/home/HeroSection'
import { QuickInfoSection } from '~/components/home/QuickInfoSection'
import { CampStylesSection } from '~/components/home/camp-styles/CampStylesSection'
import { JamEventSection } from '~/components/home/jam/JamEventSection'
import { CampScheduleSection } from '~/components/home/schedule/CampScheduleSection'
import { WhyJoinSection } from '~/components/home/why-join/WhyJoinSection'
import { campJamJsonLd } from '~/lib/site-seo'
import { pageSeo } from '~/utils/seo'

export const Route = createFileRoute('/_site/')({
  head: () => {
    const { meta, links } = pageSeo({
      title: 'Fanglao Summer Dance Camp & Jam 2026',
      description:
        'ຮຽນເຕັ້ນພັກແລ້ງ ຮຽນວັດທະນະທຳ ສະແດງອອກ — Summer Camp 29 ມິ.ຖ.–17 ກ.ກ. 2026 ແລະ Fanglao Jam 18 ກໍລະກົດ 2026',
      path: '/',
    })

    return {
      meta,
      links: [
        ...links,
        {
          rel: 'preload',
          as: 'image',
          href: '/images/hero-poster.jpg',
          fetchPriority: 'high',
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(campJamJsonLd()),
        },
      ],
    }
  },
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickInfoSection />
      <WhyJoinSection />
      <CampStylesSection />
      <CampScheduleSection />
      <JamEventSection />
    </>
  )
}
