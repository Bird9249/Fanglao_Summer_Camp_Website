import { CampLogo } from '~/components/brand/CampLogo'

export function HeroCampLogo() {
  return (
    <div
      className="hero-reveal-line flex w-full justify-center"
      style={{ animationDelay: '60ms' }}
    >
      <CampLogo size="hero" priority />
    </div>
  )
}
