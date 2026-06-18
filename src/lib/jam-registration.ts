import { z } from 'zod'

export const jamRegistrationSchema = z
  .object({
    categoryId: z.string().min(1, 'ກະລຸນາເລືອກໝວດແຂ່ງຂັນ'),
    fullName: z.string().trim().min(2, 'ກະລຸນາໃສ່ຊື່').max(100),
    nickname: z.string().trim().max(50).optional(),
    phone: z
      .string()
      .trim()
      .min(8, 'ເບີໂທບໍ່ຖືກຕ້ອງ')
      .max(20)
      .regex(/^[\d\s+\-()]+$/, 'ເບີໂທບໍ່ຖືກຕ້ອງ'),
    teamName: z.string().trim().max(100).optional(),
    partnerFullName: z.string().trim().max(100).optional(),
    partnerNickname: z.string().trim().max(50).optional(),
    partnerPhone: z
      .string()
      .trim()
      .max(20)
      .regex(/^[\d\s+\-()]*$/)
      .optional(),
  })
  .superRefine((data, ctx) => {
    const team = data.teamName?.trim()
    const partner = data.partnerFullName?.trim()
    if (team && !partner) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ກະລຸນາໃສ່ຊື່ສະມາຊິກທີ 2',
        path: ['partnerFullName'],
      })
    }
    if (team && !data.fullName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ກະລຸນາໃສ່ຊື່ສະມາຊິກທີ 1',
        path: ['fullName'],
      })
    }
  })

export type JamRegistrationFormInput = z.input<typeof jamRegistrationSchema>
export type JamRegistrationFormValues = z.infer<typeof jamRegistrationSchema>

export const JAM_SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  EVENT_NOT_OPEN: 'ປິດຮັບລົງທະບຽນແລ້ວ',
  CATEGORY_FULL: 'ໝວດນີ້ເຕັມແລ້ວ — ກະລຸນາເລືອກໝວດອື່ນ',
  INVALID_CATEGORY: 'ໝວດແຂ່ງຂັນບໍ່ຖືກຕ້ອງ — ກະລຸນາໂຫຼດໜ້າໃໝ່',
  TEAM_NAME_REQUIRED: 'ກະລຸນາໃສ່ຊື່ທີມ',
  PARTNER_NAME_REQUIRED: 'ກະລຸນາໃສ່ຊື່ສະມາຊິກທີ 2',
  NETWORK: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້ — ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
  UNKNOWN: 'ສົ່ງແບບຟອມບໍ່ສຳເລັດ — ກະລຸນາລອງໃໝ່',
}
