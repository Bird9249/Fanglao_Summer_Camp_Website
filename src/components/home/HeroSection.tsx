import * as React from 'react'
import { siteMeta } from '~/components/layout/nav'
import { cn } from '~/lib/utils'
import { HeroCampLogo } from './HeroCampLogo'
import { MagneticCtaButton } from './MagneticCtaButton'

const HERO_VIDEO_SRC = '/videos/RecapVerticalLaoHiphop3.mp4'
const HERO_POSTER_SRC = '/images/hero-poster.jpg'

export function HeroSection() {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = React.useState(false)
  const [videoReady, setVideoReady] = React.useState(false)

  React.useEffect(() => {
    if (videoFailed) return

    const video = videoRef.current
    if (!video) return

    const markReady = () => setVideoReady(true)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady()
    }

    video.addEventListener('loadeddata', markReady)
    video.addEventListener('canplay', markReady)

    void video.play().catch(() => {
      // Autoplay may be blocked; poster still shows until user interacts.
    })

    return () => {
      video.removeEventListener('loadeddata', markReady)
      video.removeEventListener('canplay', markReady)
    }
  }, [videoFailed])

  return (
    <section
      id="hero-section"
      aria-label="Fanglao Summer Camp & Jam 2026"
      className="hero-section relative flex min-h-[calc(100dvh-4rem)] scroll-mt-18 items-center justify-center overflow-hidden px-4 py-16 md:min-h-[calc(100dvh-3.5rem)] md:py-20"
    >
      <div aria-hidden className="hero-fallback-bg absolute inset-0" data-active />

      {!videoFailed ? (
        <video
          ref={videoRef}
          poster={HERO_POSTER_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          // @ts-expect-error fetchPriority is valid on <video> in HTML; React types omit it
          fetchPriority="high"
          className={cn(
            'hero-video absolute inset-0 z-0 size-full object-cover',
            videoReady && 'hero-video--ready',
          )}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      ) : null}

      <div aria-hidden className="hero-ambient">
        <span className="hero-ambient-orb hero-ambient-orb--gold" />
        <span className="hero-ambient-orb hero-ambient-orb--violet" />
      </div>

      <div aria-hidden className="hero-overlay absolute inset-0" />

      <div className="hero-content relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:gap-10">
        <p
          className="hero-lao-kicker hero-reveal-line"
          style={{ animationDelay: '0.1s' }}
        >
          {siteMeta.campDates} · {siteMeta.jamDate}
        </p>

        <div
          className="hero-logo-stack hero-reveal-line"
          style={{ animationDelay: '0.28s' }}
        >
          <HeroCampLogo />
          <span
            className="hero-slogan-rule mx-auto"
            style={{ animationDelay: '0.72s' }}
          />
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:justify-center">
          <div
            className="hero-reveal-line flex-1 sm:flex-none"
            style={{ animationDelay: '0.52s' }}
          >
            <MagneticCtaButton to="/register/camp" variant="gold">
              ລົງທະບຽນ Summer Camp
            </MagneticCtaButton>
          </div>
          <div
            className="hero-reveal-line flex-1 sm:flex-none"
            style={{ animationDelay: '0.66s' }}
          >
            <MagneticCtaButton to="/register/jam" variant="purple">
              ສະໝັກແຂ່ງ Fanglao Jam
            </MagneticCtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
