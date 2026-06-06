import { createServerFn } from '@tanstack/react-start'
import type { CampRegistrationSubmitInput } from '~/lib/camp-registration-api'
import {
  fetchCampClasses,
  submitCampRegistration,
} from '~/lib/camp-registration-api'

export const getCampClasses = createServerFn({ method: 'GET' }).handler(
  async () => fetchCampClasses(),
)

export const submitCampRegistrationFn = createServerFn({ method: 'POST' })
  .inputValidator((data: CampRegistrationSubmitInput) => data)
  .handler(async ({ data }) => submitCampRegistration(data))
