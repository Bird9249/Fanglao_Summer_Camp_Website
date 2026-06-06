declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function getGaMeasurementId(): string | undefined {
  const id = process.env.GA_MEASUREMENT_ID?.trim()
  if (!id) return undefined
  if (!/^G-[A-Z0-9]+$/i.test(id)) return undefined
  return id
}

/** โหลด GA เฉพาะ production และมี Measurement ID */
export function shouldLoadGoogleAnalytics(): boolean {
  return !!getGaMeasurementId() && !import.meta.env.DEV
}

function gtagSafe(...args: unknown[]) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag(...args)
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  if (!shouldLoadGoogleAnalytics()) return

  gtagSafe('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
    page_location: window.location.href,
  })
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  if (!shouldLoadGoogleAnalytics()) return
  gtagSafe('event', eventName, params)
}
