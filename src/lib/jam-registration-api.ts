export type JamCategoryPublicDTO = {
  id: string
  categoryKey: string
  name: string
  labelLao: string
  description: string | null
  format: 'solo' | 'duo'
  kind: 'qualifier' | 'battle'
  sortOrder: number
  capacity: number | null
  claimed: number
  remaining: number | null
  availability: 'open' | 'full'
}

export type JamEventPublicDTO = {
  slug: string
  title: string
  status: 'draft' | 'open' | 'closed'
}

export type JamCategoriesResponse = {
  event: JamEventPublicDTO
  categories: JamCategoryPublicDTO[]
}

export type JamRegistrationSubmitInput = {
  categoryId: string
  fullName: string
  nickname?: string
  phoneNumber: string
  teamName?: string
  partnerFullName?: string
  partnerNickname?: string
  partnerPhone?: string
}

export type JamRegistrationSubmitResult = {
  registrationId: string
  status: string
  submittedAt: string
}

export type JamApiErrorCode =
  | 'EVENT_NOT_OPEN'
  | 'EVENT_NOT_FOUND'
  | 'INVALID_CATEGORY'
  | 'CATEGORY_FULL'
  | 'TEAM_NAME_REQUIRED'
  | 'PARTNER_NAME_REQUIRED'
  | 'DUO_FIELDS_NOT_ALLOWED'
  | 'NETWORK'
  | 'UNKNOWN'

function jamApiConfig() {
  const baseUrl = (
    process.env.ADMIN_API_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '')
  const apiKey = process.env.CAMP_API_KEY?.trim() ?? ''
  const slug = process.env.JAM_EVENT_SLUG?.trim() ?? 'fanglao-jam-2026'

  return { baseUrl, apiKey, slug }
}

export function jamPublicHeaders(): HeadersInit {
  const { apiKey } = jamApiConfig()
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (apiKey) headers['X-Camp-Api-Key'] = apiKey
  return headers
}

async function parseJamApiError(
  res: Response,
): Promise<{ code: JamApiErrorCode; status: number }> {
  const body = (await res.json().catch(() => ({}))) as { error?: string }

  if (res.status === 403 && body.error === 'EVENT_NOT_OPEN') {
    return { code: 'EVENT_NOT_OPEN', status: 403 }
  }
  if (res.status === 404) {
    return { code: 'EVENT_NOT_FOUND', status: 404 }
  }
  if (res.status === 409 && body.error === 'CATEGORY_FULL') {
    return { code: 'CATEGORY_FULL', status: 409 }
  }
  if (res.status === 422) {
    const code =
      typeof body.error === 'string'
        ? (body.error as JamApiErrorCode)
        : 'UNKNOWN'
    return { code, status: 422 }
  }
  return { code: 'UNKNOWN', status: res.status }
}

export async function fetchJamCategories(): Promise<
  | { ok: true; data: JamCategoriesResponse }
  | { ok: false; code: JamApiErrorCode; status?: number }
> {
  const { baseUrl, slug } = jamApiConfig()

  try {
    const res = await fetch(`${baseUrl}/api/public/jam/${slug}/categories`, {
      headers: jamPublicHeaders(),
      cache: 'no-store',
    })

    if (!res.ok) {
      const err = await parseJamApiError(res)
      return { ok: false, ...err }
    }

    const data = (await res.json()) as JamCategoriesResponse
    return { ok: true, data }
  } catch {
    return { ok: false, code: 'NETWORK' }
  }
}

export async function submitJamRegistration(
  input: JamRegistrationSubmitInput,
): Promise<
  | { ok: true; data: JamRegistrationSubmitResult }
  | { ok: false; code: JamApiErrorCode; status?: number }
> {
  const { baseUrl, slug } = jamApiConfig()

  try {
    const res = await fetch(
      `${baseUrl}/api/public/jam/${slug}/registrations`,
      {
        method: 'POST',
        headers: {
          ...jamPublicHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    )

    const body = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >

    if (!res.ok) {
      if (res.status === 403 && body.error === 'EVENT_NOT_OPEN') {
        return { ok: false, code: 'EVENT_NOT_OPEN', status: 403 }
      }
      if (res.status === 409 && body.error === 'CATEGORY_FULL') {
        return { ok: false, code: 'CATEGORY_FULL', status: 409 }
      }
      if (res.status === 422) {
        const code =
          typeof body.error === 'string'
            ? (body.error as JamApiErrorCode)
            : 'UNKNOWN'
        return { ok: false, code, status: 422 }
      }
      return { ok: false, code: 'UNKNOWN', status: res.status }
    }

    return {
      ok: true,
      data: body as JamRegistrationSubmitResult,
    }
  } catch {
    return { ok: false, code: 'NETWORK' }
  }
}
