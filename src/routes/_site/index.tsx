import { createFileRoute } from '@tanstack/react-router'
import { CampStylesSection } from '~/components/home/camp-styles/CampStylesSection'
import { HeroSection } from '~/components/home/HeroSection'
import { JamEventSection } from '~/components/home/jam/JamEventSection'
import { QuickInfoSection } from '~/components/home/QuickInfoSection'
import { campJamJsonLd } from '~/lib/site-seo'
import { pageSeo } from '~/utils/seo'

export const Route = createFileRoute('/_site/')({
  head: () => {
    const { meta, links } = pageSeo({
      title: 'Fanglao Summer Dance Camp & Jam 2026',
      description:
        'ຮຽນເຕັ້ນພັກແລ້ງ ຮຽນວັດທະນະທຳ ສະແດງອອກ — Summer Camp 29 ມິ.ຖ.–17 ກ.ກ. 2026 ແລະ Fanglao Jam 18 ກ.ກ. 2026',
      path: '/',
    })

    return {
      meta,
      links,
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
      <CampStylesSection />
      <JamEventSection />
    </>
  )
}
