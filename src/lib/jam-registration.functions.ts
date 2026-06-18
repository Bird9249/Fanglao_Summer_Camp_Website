import { createServerFn } from '@tanstack/react-start'
import type { JamRegistrationSubmitInput } from '~/lib/jam-registration-api'
import {
  fetchJamCategories,
  submitJamRegistration,
} from '~/lib/jam-registration-api'

export const getJamCategories = createServerFn({ method: 'GET' }).handler(
  async () => fetchJamCategories(),
)

export const submitJamRegistrationFn = createServerFn({ method: 'POST' })
  .inputValidator((data: JamRegistrationSubmitInput) => data)
  .handler(async ({ data }) => submitJamRegistration(data))
