import type { z } from 'zod'

export async function parseJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<
  | { ok: true; data: z.infer<T> }
  | { ok: false; response: Response }
> {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return {
      ok: false,
      response: Response.json({ error: 'Invalid JSON' }, { status: 400 }),
    }
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      ok: false,
      response: Response.json(
        { error: 'Validation failed', issues: parsed.error.flatten() },
        { status: 400 },
      ),
    }
  }

  return { ok: true, data: parsed.data }
}
