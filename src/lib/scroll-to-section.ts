const HEADER_OFFSET = 72

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (!element) return

  const top =
    element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET

  window.scrollTo({ top, behavior: 'smooth' })
  window.history.replaceState(null, '', `/#${sectionId}`)
}

export function scrollToSectionFromHash(hash: string) {
  const sectionId = hash.replace(/^#/, '')
  if (!sectionId) return
  scrollToSection(sectionId)
}
