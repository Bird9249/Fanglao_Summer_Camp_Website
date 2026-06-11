export type NavSection = {
  sectionId: string
  label: string
}

export const mainNav: NavSection[] = [
  { sectionId: 'hero-section', label: 'ຫນ້າຫຼັກ' },
  { sectionId: 'camp-styles', label: 'Summer Camp' },
  { sectionId: 'camp-schedule', label: 'ຕາຕະລາງ' },
  { sectionId: 'jam-event', label: 'Fanglao Jam' },
  { sectionId: 'contact', label: 'ຕິດຕໍ່' },
]

export const registerNav = [
  { to: '/register/camp', label: 'ລົງທະບຽນ Camp' },
  { to: '/register/jam', label: 'ລົງທະບຽນ Jam' },
] as const

export const siteMeta = {
  brand: 'Fanglao Studio',
  tagline: 'Dance is our language',
  slogan: 'LEARN THE DANCE. UNDERSTAND THE CULTURE. EXPRESS YOURSELF.',
  campDates: '29 ມິຖຸນາ – 17 ກໍລະກົດ 2026',
  jamDate: '18 ກໍລະກົດ 2026',
  campLocation: 'Fanglao Studio, Vientiane Center 4F',
  jamLocation: 'Lao National Circus, Vientiane',
} as const
