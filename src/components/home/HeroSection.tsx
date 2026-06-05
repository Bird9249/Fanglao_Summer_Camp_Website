import * as React from 'react'
import { HeroLaoTitle } from './HeroLaoTitle'
import { HeroTextReveal } from './HeroTextReveal'
import { MagneticCtaButton } from './MagneticCtaButton'

const HERO_VIDEO_SRC = '/videos/RecapVerticalLaoHiphop3.mp4'

export function HeroSection() {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = React.useState(false)

  return (
    <section
      id="hero-section"
      aria-label="Fanglao Summer Camp & Jam 2026"
      className="relative flex min-h-[calc(100dvh-4rem)] scroll-mt-18 items-center justify-center overflow-hidden px-4 py-16 md:min-h-[calc(100dvh-3.5rem)] md:py-20"
    >
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
          onError={() => setVideoFailed(true)}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : null}

      <div
        aria-hidden
        className="hero-fallback-bg absolute inset-0"
        data-active={videoFailed || undefined}
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-background/60"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:gap-10">
        <div className="flex w-full flex-col items-center gap-2 md:gap-3">
          <HeroLaoTitle />
          <HeroTextReveal />
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center">
          <MagneticCtaButton to="/register/camp" variant="gold">
            ລົງທະບຽນ Summer Camp
          </MagneticCtaButton>
          <MagneticCtaButton to="/register/jam" variant="jam">
            ສະໝັກແຂ່ງ Fanglao Jam
          </MagneticCtaButton>
        </div>
      </div>
    </section>
  )
}
