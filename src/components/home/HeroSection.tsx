import * as React from 'react'
import { HeroCampLogo } from './HeroCampLogo'
import { MagneticCtaButton } from './MagneticCtaButton'

const HERO_VIDEO_SRC = '/videos/RecapVerticalLaoHiphop3.mp4'
const HERO_POSTER_SRC = '/images/hero-poster.jpg'

export function HeroSection() {
  const [videoFailed, setVideoFailed] = React.useState(false)

  return (
    <section
      id="hero-section"
      aria-label="Fanglao Summer Camp & Jam 2026"
      className="relative flex min-h-[calc(100dvh-4rem)] scroll-mt-18 items-center justify-center overflow-hidden px-4 py-16 md:min-h-[calc(100dvh-3.5rem)] md:py-20"
    >
      <div aria-hidden className="hero-fallback-bg absolute inset-0" data-active />

      {!videoFailed ? (
        <video
          poster={HERO_POSTER_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          // @ts-expect-error fetchPriority is valid on <video> in HTML; React types omit it
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
          onError={() => setVideoFailed(true)}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : null}

      <div
        aria-hidden
        className="absolute inset-0 bg-background/60"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:gap-10">
        <HeroCampLogo />

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center">
          <MagneticCtaButton to="/register/camp" variant="gold">
            ລົງທະບຽນ Summer Camp
          </MagneticCtaButton>
          <MagneticCtaButton to="/register/jam" variant="purple">
            ສະໝັກແຂ່ງ Fanglao Jam
          </MagneticCtaButton>
        </div>
      </div>
    </section>
  )
}
