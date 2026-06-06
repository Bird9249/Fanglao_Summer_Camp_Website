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

let gaInitPromise: Promise<void> | null = null

/** โหลด gtag หลัง paint — ลด forced reflow ตอน first load */
export function initGoogleAnalytics(): Promise<void> {
  if (!shouldLoadGoogleAnalytics()) return Promise.resolve()
  if (typeof window === 'undefined') return Promise.resolve()
  if (gaInitPromise) return gaInitPromise

  const measurementId = getGaMeasurementId()
  if (!measurementId) return Promise.resolve()

  gaInitPromise = new Promise((resolve) => {
    const bootstrap = () => {
      window.dataLayer = window.dataLayer ?? []
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }
      window.gtag('js', new Date())
      window.gtag('config', measurementId, { send_page_view: false })

      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      script.onload = () => resolve()
      script.onerror = () => resolve()
      document.head.appendChild(script)
    }

    const schedule =
      'requestIdleCallback' in window
        ? (cb: () => void) =>
            window.requestIdleCallback(cb, { timeout: 4000 })
        : (cb: () => void) => window.setTimeout(cb, 1500)

    if (document.readyState === 'complete') {
      schedule(bootstrap)
    } else {
      window.addEventListener('load', () => schedule(bootstrap), { once: true })
    }
  })

  return gaInitPromise
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
