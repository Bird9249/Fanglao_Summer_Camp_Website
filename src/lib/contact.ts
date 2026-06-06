import {
  RiFacebookFill,
  RiInstagramFill,
  RiTiktokFill,
  RiWhatsappFill
} from '@remixicon/react'
import type { ComponentType } from 'react'

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
    href: 'https://www.instagram.com/fanglao.studio/?hl=en',
    icon: RiInstagramFill,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@fanglaodancestudio?is_from_webapp=1&sender_device=pc',
    icon: RiTiktokFill,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/FanglaoDanceStudio/',
    icon: RiFacebookFill,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/8562055706809',
    icon: RiWhatsappFill,
  },
]
