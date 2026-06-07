declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

declare const __BAKED_GA_MEASUREMENT_ID__: string

function readGaMeasurementIdFromEnv() {
  const baked =
    typeof __BAKED_GA_MEASUREMENT_ID__ === 'string' &&
    __BAKED_GA_MEASUREMENT_ID__
      ? __BAKED_GA_MEASUREMENT_ID__
      : undefined

  return (
    baked ||
    import.meta.env.GA_MEASUREMENT_ID ||
    process.env.GA_MEASUREMENT_ID
  )?.trim()
}

export function getGaMeasurementId(): string | undefined {
  const id = readGaMeasurementIdFromEnv()
  if (!id) return undefined
  if (!/^G-[A-Z0-9]+$/i.test(id)) return undefined
  return id
}

/** โหลด GA เฉพาะ production และมี Measurement ID */
export function shouldLoadGoogleAnalytics(): boolean {
  return !!getGaMeasurementId() && !import.meta.env.DEV
}

type HeadScript = {
  src?: string
  async?: boolean
  children?: string
  type?: string
}

/** gtag ใน <head> — SEO crawlers ตรวจจับได้ และไม่บล็อก render (async) */
export function getGoogleAnalyticsHeadScripts(): HeadScript[] {
  const measurementId = getGaMeasurementId()
  if (!measurementId || import.meta.env.DEV) return []

  return [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      async: true,
    },
    {
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}',{send_page_view:false});`,
    },
  ]
}

let gaReadyPromise: Promise<void> | null = null

/** รอจน gtag พร้อม (จาก script ใน head) */
export function waitForGoogleAnalytics(): Promise<void> {
  if (!shouldLoadGoogleAnalytics()) return Promise.resolve()
  if (typeof window === 'undefined') return Promise.resolve()
  if (typeof window.gtag === 'function') return Promise.resolve()
  if (gaReadyPromise) return gaReadyPromise

  gaReadyPromise = new Promise((resolve) => {
    const started = Date.now()
    const check = () => {
      if (typeof window.gtag === 'function') {
        resolve()
        return
      }
      if (Date.now() - started > 5000) {
        resolve()
        return
      }
      window.requestAnimationFrame(check)
    }
    check()
  })

  return gaReadyPromise
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
