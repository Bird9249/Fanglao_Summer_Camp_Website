import type { ComponentType } from 'react'
import {
  RiFacebookFill,
  RiInstagramFill,
  RiMailLine,
  RiTiktokFill,
  RiWhatsappFill,
} from '@remixicon/react'

export const contactInfo = {
  email: 'kaka.fanglaostudio@gmail.com',
  map: {
    name: 'Vientiane Center',
    floor: '4F',
    studio: 'Fanglao Studio',
    lat: 17.9665,
    lng: 102.6042,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Vientiane+Center+4F+Fanglao+Studio',
  },
} as const

export type SocialLink = {
  id: string
  label: string
  href: string
  icon: ComponentType<{ size?: number | string; className?: string }>
}

export const socialLinks: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://instagram.com/fanglaostudio',
    icon: RiInstagramFill,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://tiktok.com/@fanglaostudio',
    icon: RiTiktokFill,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://facebook.com/fanglaostudio',
    icon: RiFacebookFill,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/',
    icon: RiWhatsappFill,
  },
]
