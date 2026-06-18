import { z } from 'zod'
import { CAMP_OPEN_DATE } from '~/lib/camp-countdown'

export const CAMP_MIN_AGE = 5
export const CAMP_MAX_AGE = 35

export const campStyleIds = [
  'kids',
  'kpop',
  'street-jazz',
  'hip-hop',
  'breaking',
] as const

export type CampStyleId = (typeof campStyleIds)[number]

export const campGenderIds = ['male', 'female', 'other'] as const
export type CampGender = (typeof campGenderIds)[number]

export const campGenderLabels: Record<CampGender, string> = {
  male: 'ຊາຍ',
  female: 'ຍິງ',
  other: 'ອື່ນໆ',
}

export function calculateAgeFromBirthDate(
  birthDate: Date,
  referenceDate = CAMP_OPEN_DATE,
): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear()
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())
  ) {
    age -= 1
  }

  return age
}

function parseBirthDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

export const campBirthDateBounds = {
  min: '2001-06-29',
  max: '2021-06-29',
} as const

const campRegistrationBaseSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'ກະລຸນາກອກຊື່–ນາມສະກຸນ')
    .max(100, 'ຊື່ຍາວເກີນໄປ'),
  nickname: z
    .string()
    .trim()
    .min(1, 'ກະລຸນາກອກຊື່ຫຼິ້ນ')
    .max(50, 'ຊື່ຫຼິ້ນຍາວເກີນໄປ'),
  dateOfBirth: z
    .string()
    .trim()
    .min(1, 'ກະລຸນາເລືອກວັນເດືອນປີເກີດ')
    .refine((value) => parseBirthDate(value) !== null, 'ວັນເດືອນປີເກີດບໍ່ຖືກຕ້ອງ'),
  gender: z.enum(campGenderIds, {
    message: 'ກະລຸນາເລືອກເພດ',
  }),
  genderOther: z.string().trim().max(50, 'ລາຍລະອຽດເພດຍາວເກີນໄປ').optional(),
  phone: z
    .string()
    .trim()
    .min(8, 'ກະລຸນາກອກເບີໂທທີ່ຖືກຕ້ອງ')
    .max(20, 'ເບີໂທຍາວເກີນໄປ')
    .regex(/^[\d\s+\-()]+$/, 'ເບີໂທຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ'),
  classTypeIds: z.array(z.string().min(1)).default([]),
  waitlistClassTypeIds: z.array(z.string().min(1)).default([]),
})

export const campRegistrationSchema = campRegistrationBaseSchema
  .superRefine((data, ctx) => {
    if (
      data.classTypeIds.length + (data.waitlistClassTypeIds?.length ?? 0) < 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ກະລຸນາເລືອກຢ່າງໜ້ອຍ 1 ຄລາສ ຫຼື ລົງຄິວສຳຮອງ',
        path: ['classTypeIds'],
      })
    }

    const waitlistSet = new Set(data.waitlistClassTypeIds ?? [])
    for (const id of waitlistSet) {
      if (data.classTypeIds.includes(id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'ຄລາສຄິວສຳຮອງຕ້ອງແຍກຈາກຄລາສທີ່ຈອງໄດ້',
          path: ['waitlistClassTypeIds'],
        })
      }
    }
    const birthDate = parseBirthDate(data.dateOfBirth)
    if (!birthDate) return

    if (birthDate > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ວັນເດືອນປີເກີດຕ້ອງບໍ່ເປັນອະນາຄົດ',
        path: ['dateOfBirth'],
      })
      return
    }

    const age = calculateAgeFromBirthDate(birthDate)

    if (age < CAMP_MIN_AGE || age > CAMP_MAX_AGE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `ອາຍຸຕ້ອງຢູ່ໃນໄລຍະ ${CAMP_MIN_AGE}–${CAMP_MAX_AGE} ປີ (ນັບຮອດວັນເປີດ Camp)`,
        path: ['dateOfBirth'],
      })
    }

    if (data.gender === 'other' && !data.genderOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ກະລຸນາລະບຸເພດ',
        path: ['genderOther'],
      })
    }
  })
  .transform((data) => {
    const birthDate = parseBirthDate(data.dateOfBirth)!
    return {
      ...data,
      age: calculateAgeFromBirthDate(birthDate),
      genderOther:
        data.gender === 'other' ? data.genderOther?.trim() : undefined,
    }
  })

export type CampRegistrationFormInput = z.input<typeof campRegistrationSchema>
export type CampRegistrationFormValues = z.output<typeof campRegistrationSchema>

export function formatGenderDisplay(
  data: Pick<CampRegistrationFormValues, 'gender' | 'genderOther'>,
) {
  if (data.gender === 'other') {
    return data.genderOther?.trim() || campGenderLabels.other
  }

  return campGenderLabels[data.gender]
}

export function isCampStyleId(value: string): value is CampStyleId {
  return (campStyleIds as readonly string[]).includes(value)
}

export function formatBirthDateLao(dateValue: string) {
  const birthDate = parseBirthDate(dateValue)
  if (!birthDate) return dateValue

  return birthDate.toLocaleDateString('lo-LA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
