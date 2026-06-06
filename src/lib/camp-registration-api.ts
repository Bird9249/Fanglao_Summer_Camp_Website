export type CampEventPublicDTO = {
  slug: string
  title: string
  status: 'draft' | 'open' | 'closed'
  minAge: number
  maxAge: number
  ageReferenceDate: string
}

export type CampClassPublicDTO = {
  classTypeId: string
  name: string
  labelLao: string
  description: string | null
  sortOrder: number
}

export type CampClassesResponse = {
  event: CampEventPublicDTO
  classes: CampClassPublicDTO[]
}

export type CampRegistrationSubmitInput = {
  fullName: string
  nickname: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  genderOther?: string
  phoneNumber: string
  classTypeIds: string[]
}

export type CampRegistrationSubmitResult = {
  registrationId: string
  status: string
  submittedAt: string
}

export type CampApiErrorCode =
  | 'EVENT_NOT_OPEN'
  | 'EVENT_NOT_FOUND'
  | 'INVALID_CLASS'
  | 'AGE_OUT_OF_RANGE'
  | 'NETWORK'
  | 'UNKNOWN'

function campApiConfig() {
  const baseUrl = (
    process.env.ADMIN_API_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '')
  const apiKey = process.env.CAMP_API_KEY?.trim() ?? ''
  const slug = process.env.CAMP_EVENT_SLUG?.trim() ?? 'summer-camp-2026'

  return { baseUrl, apiKey, slug }
}

export function campPublicHeaders(): HeadersInit {
  const { apiKey } = campApiConfig()
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (apiKey) headers['X-Camp-Api-Key'] = apiKey
  return headers
}

export async function fetchCampClasses(): Promise<
  | { ok: true; data: CampClassesResponse }
  | { ok: false; code: CampApiErrorCode; status?: number }
> {
  const { baseUrl, slug } = campApiConfig()

  try {
    const res = await fetch(`${baseUrl}/api/public/camp/${slug}/classes`, {
      headers: campPublicHeaders(),
      cache: 'no-store',
    })

    if (res.status === 403) {
      const body = (await res.json().catch(() => ({}))) as {
        error?: string
      }
      if (body.error === 'EVENT_NOT_OPEN') {
        return { ok: false, code: 'EVENT_NOT_OPEN', status: 403 }
      }
    }

    if (res.status === 404) {
      return { ok: false, code: 'EVENT_NOT_FOUND', status: 404 }
    }

    if (!res.ok) {
      return { ok: false, code: 'UNKNOWN', status: res.status }
    }

    const data = (await res.json()) as CampClassesResponse
    return { ok: true, data }
  } catch {
    return { ok: false, code: 'NETWORK' }
  }
}

export async function submitCampRegistration(
  input: CampRegistrationSubmitInput,
): Promise<
  | { ok: true; data: CampRegistrationSubmitResult }
  | {
      ok: false
      code: CampApiErrorCode
      status?: number
      fieldErrors?: Record<string, string>
    }
> {
  const { baseUrl, slug } = campApiConfig()

  try {
    const res = await fetch(
      `${baseUrl}/api/public/camp/${slug}/registrations`,
      {
        method: 'POST',
        headers: {
          ...campPublicHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    )

    const body = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >

    if (res.status === 403 && body.error === 'EVENT_NOT_OPEN') {
      return { ok: false, code: 'EVENT_NOT_OPEN', status: 403 }
    }

    if (res.status === 422) {
      const code =
        typeof body.error === 'string'
          ? (body.error as CampApiErrorCode)
          : 'UNKNOWN'
      return { ok: false, code, status: 422 }
    }

    if (!res.ok) {
      return { ok: false, code: 'UNKNOWN', status: res.status }
    }

    return {
      ok: true,
      data: body as CampRegistrationSubmitResult,
    }
  } catch {
    return { ok: false, code: 'NETWORK' }
  }
}
