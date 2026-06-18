import { zodResolver } from '@hookform/resolvers/zod'
import {
  RiPhoneLine,
  RiSwordLine,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react'
import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { trackGaEvent } from '~/lib/analytics'
import {
  getJamCategoryDisplayName,
  getJamFormatLabel,
} from '~/lib/jam-category-display'
import type { JamCategoryPublicDTO } from '~/lib/jam-registration-api'
import {
  getJamCategories,
  submitJamRegistrationFn,
} from '~/lib/jam-registration.functions'
import {
  JAM_SUBMIT_ERROR_MESSAGES,
  jamRegistrationSchema,
  type JamRegistrationFormInput,
  type JamRegistrationFormValues,
} from '~/lib/jam-registration'
import { cn } from '~/lib/utils'
import { JamCategorySelector } from './JamCategorySelector'
import { JamRegistrationSuccess } from './JamRegistrationSuccess'

function FormField({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function StepPill({
  step,
  label,
  active,
  done,
}: {
  step: number
  label: string
  active: boolean
  done: boolean
}) {
  return (
    <div
      className={cn(
        'jam-reg-step',
        active && 'jam-reg-step--active text-foreground',
        done && !active && 'jam-reg-step--done text-muted-foreground',
        !active && !done && 'text-muted-foreground/70',
      )}
    >
      <span className="jam-reg-step-num">{done && !active ? '✓' : step}</span>
      <span>{label}</span>
    </div>
  )
}

type SuccessState = {
  registrationId: string
  data: JamRegistrationFormValues
  categoryLabel: string
}

export function JamRegistrationForm({
  categories: initialCategories,
  defaultCategoryId,
}: {
  categories: JamCategoryPublicDTO[]
  defaultCategoryId?: string
}) {
  const [success, setSuccess] = React.useState<SuccessState | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [liveCategories, setLiveCategories] =
    React.useState(initialCategories)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JamRegistrationFormInput, unknown, JamRegistrationFormValues>({
    resolver: zodResolver(jamRegistrationSchema),
    defaultValues: {
      categoryId: defaultCategoryId ?? '',
      fullName: '',
      nickname: '',
      phone: '',
      teamName: '',
      partnerFullName: '',
      partnerNickname: '',
      partnerPhone: '',
    },
  })

  const selectedCategoryId = watch('categoryId')
  const selectedCategory = liveCategories.find((c) => c.id === selectedCategoryId)
  const isDuo = selectedCategory?.format === 'duo'
  const hasCategory = !!selectedCategoryId

  React.useEffect(() => {
    setLiveCategories(initialCategories)
  }, [initialCategories])

  React.useEffect(() => {
    if (isSubmitting) return

    const refresh = async () => {
      const result = await getJamCategories()
      if (result.ok) {
        setLiveCategories(result.data.categories)
      }
    }

    const timer = window.setInterval(refresh, 20_000)
    return () => window.clearInterval(timer)
  }, [isSubmitting])

  React.useEffect(() => {
    if (!isDuo) {
      setValue('teamName', '')
      setValue('partnerFullName', '')
      setValue('partnerNickname', '')
      setValue('partnerPhone', '')
    }
  }, [isDuo, setValue])

  const onSubmit = async (values: JamRegistrationFormValues) => {
    setSubmitError(null)

    const category = liveCategories.find((c) => c.id === values.categoryId)
    const duo = category?.format === 'duo'

    if (duo) {
      if (!values.teamName?.trim()) {
        setError('teamName', { message: 'ກະລຸນາໃສ່ຊື່ທີມ' })
        return
      }
      if (!values.partnerFullName?.trim()) {
        setError('partnerFullName', { message: 'ກະລຸນາໃສ່ຊື່ສະມາຊິກທີ 2' })
        return
      }
    }

    const result = await submitJamRegistrationFn({
      data: {
        categoryId: values.categoryId,
        fullName: values.fullName,
        nickname: values.nickname || undefined,
        phoneNumber: values.phone,
        teamName: duo ? values.teamName : undefined,
        partnerFullName: duo ? values.partnerFullName : undefined,
        partnerNickname: duo ? values.partnerNickname || undefined : undefined,
        partnerPhone: duo ? values.partnerPhone || undefined : undefined,
      },
    })

    if (!result.ok) {
      trackGaEvent('jam_register_error', {
        error_code: result.code ?? 'UNKNOWN',
      })

      if (result.code === 'CATEGORY_FULL') {
        const refreshed = await getJamCategories()
        if (refreshed.ok) setLiveCategories(refreshed.data.categories)
      }

      setSubmitError(
        JAM_SUBMIT_ERROR_MESSAGES[result.code] ??
          JAM_SUBMIT_ERROR_MESSAGES.UNKNOWN,
      )
      return
    }

    trackGaEvent('jam_register_submit', {
      category_key: category?.categoryKey ?? 'unknown',
    })

    setSuccess({
      registrationId: result.data.registrationId,
      data: values,
      categoryLabel:
        category ? getJamCategoryDisplayName(category) : '',
    })
  }

  const handleRegisterAgain = () => {
    setSuccess(null)
    reset({
      categoryId: defaultCategoryId ?? '',
      fullName: '',
      nickname: '',
      phone: '',
      teamName: '',
      partnerFullName: '',
      partnerNickname: '',
      partnerPhone: '',
    })
  }

  const categoryFull = selectedCategory?.availability === 'full'

  return (
    <>
      {success ? (
        <JamRegistrationSuccess
          registrationId={success.registrationId}
          data={success.data}
          categoryLabel={success.categoryLabel}
          onRegisterAgain={handleRegisterAgain}
        />
      ) : null}

      {!success ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8"
    >
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/60 bg-card/40 px-4 py-3">
        <StepPill step={1} label="ເລືອກໝວດ" active={!hasCategory} done={hasCategory} />
        <div aria-hidden className="hidden h-px w-6 bg-border sm:block" />
        <StepPill step={2} label="ຂໍ້ມູນຜູ້ສະໝັກ" active={hasCategory} done={false} />
      </div>

      <Card className="border-primary/20 bg-card/80">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <RiSwordLine size={20} />
            </div>
            <div>
              <CardTitle className="font-heading text-lg uppercase">
                ເລືອກໝວດແຂ່ງຂັນ
              </CardTitle>
              <CardDescription>
                Qualifier ຫຼື Battle — ເລືອກໄດ້ 1 ໝວດຕໍ່ 1 ໃບສະໝັກ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <JamCategorySelector
                categories={liveCategories}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.categoryId?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </CardContent>
      </Card>

      {selectedCategory ? (
        <div className="jam-reg-summary flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              ໝວດທີ່ເລືອກ
            </p>
            <p className="font-heading text-sm font-bold uppercase">
              {getJamCategoryDisplayName(selectedCategory)}
            </p>
            <p className="text-xs text-muted-foreground">
              {getJamFormatLabel(selectedCategory.format)}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setValue('categoryId', '', { shouldValidate: true })}
          >
            ປ່ຽນໝວດ
          </Button>
        </div>
      ) : null}

      <Card
        className={cn(
          'bg-card/80 transition-all duration-300',
          !hasCategory && 'pointer-events-none opacity-45',
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              {isDuo ? <RiTeamLine size={20} /> : <RiUserLine size={20} />}
            </div>
            <div>
              <CardTitle className="font-heading text-lg uppercase">
                {isDuo ? 'ຂໍ້ມູນທີມ' : 'ຂໍ້ມູນຜູ້ສະໝັກ'}
              </CardTitle>
              <CardDescription>
                {isDuo
                  ? 'ກະລຸນາໃສ່ຊື່ທີມ, ຊື່–ນາມສະກຸນ ແລະ AKA (ຖ້າມີ) ຂອງສະມາຊິກທັງ 2 ຄົນ'
                  : 'ຊື່ ແລະ ເບີໂທຕິດຕໍ່ສຳລັບຢືນຢັນການສະໝັກ'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {isDuo ? (
            <>
              <FormField
                id="teamName"
                label="ຊື່ທີມ"
                hint="ຊື່ທີ່ໃຊ້ໃນການແຂ່ງຂັນ"
                error={errors.teamName?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="teamName"
                  placeholder="ຕົວຢ່າງ: VTE Breakers"
                  aria-invalid={!!errors.teamName}
                  disabled={!hasCategory}
                  {...register('teamName')}
                />
              </FormField>

              <div className="sm:col-span-2 rounded-xl border border-border/70 bg-muted/15 p-4">
                <p className="mb-4 font-heading text-xs font-bold uppercase tracking-wide text-primary">
                  ສະມາຊິກທີ 1
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="fullName"
                    label="ຊື່–ນາມສະກຸນ"
                    error={errors.fullName?.message}
                  >
                    <Input
                      id="fullName"
                      autoComplete="name"
                      placeholder="ຕົວຢ່າງ: ສົມຊາຍ ວົງສະຫວັນ"
                      aria-invalid={!!errors.fullName}
                      disabled={!hasCategory}
                      {...register('fullName')}
                    />
                  </FormField>
                  <FormField
                    id="nickname"
                    label="AKA (ຖ້າມີ)"
                    hint="Also Known As · ຊື່ທີ່ໃຊ້ໃນການແຂ່ງຂັນ"
                    error={errors.nickname?.message}
                  >
                    <Input
                      id="nickname"
                      autoComplete="nickname"
                      placeholder="ຕົວຢ່າງ: B-Boy ຊາຍ"
                      aria-invalid={!!errors.nickname}
                      disabled={!hasCategory}
                      {...register('nickname')}
                    />
                  </FormField>
                </div>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-border/70 bg-muted/15 p-4">
                <p className="mb-4 font-heading text-xs font-bold uppercase tracking-wide text-primary">
                  ສະມາຊິກທີ 2
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    id="partnerFullName"
                    label="ຊື່–ນາມສະກຸນ"
                    error={errors.partnerFullName?.message}
                  >
                    <Input
                      id="partnerFullName"
                      autoComplete="name"
                      placeholder="ຕົວຢ່າງ: ພັນທະວັດ ສີສະຫວາດ"
                      aria-invalid={!!errors.partnerFullName}
                      disabled={!hasCategory}
                      {...register('partnerFullName')}
                    />
                  </FormField>
                  <FormField
                    id="partnerNickname"
                    label="AKA (ຖ້າມີ)"
                    hint="Also Known As · ຊື່ທີ່ໃຊ້ໃນການແຂ່ງຂັນ"
                    error={errors.partnerNickname?.message}
                  >
                    <Input
                      id="partnerNickname"
                      autoComplete="nickname"
                      placeholder="ຕົວຢ່າງ: B-Girl ວັດ"
                      aria-invalid={!!errors.partnerNickname}
                      disabled={!hasCategory}
                      {...register('partnerNickname')}
                    />
                  </FormField>
                  <FormField
                    id="partnerPhone"
                    label="ເບີໂທ (ຖ້າມີ)"
                    error={errors.partnerPhone?.message}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="partnerPhone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="020 XXXX XXXX"
                      aria-invalid={!!errors.partnerPhone}
                      disabled={!hasCategory}
                      {...register('partnerPhone')}
                    />
                  </FormField>
                </div>
              </div>
            </>
          ) : (
            <>
              <FormField
                id="fullName"
                label="ຊື່–ນາມສະກຸນ"
                error={errors.fullName?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="ຕົວຢ່າງ: ສົມຊາຍ ວົງສະຫວັນ"
                  aria-invalid={!!errors.fullName}
                  disabled={!hasCategory}
                  {...register('fullName')}
                />
              </FormField>
              <FormField
                id="nickname"
                label="AKA (ຖ້າມີ)"
                hint="Also Known As · ຊື່ທີ່ໃຊ້ໃນການແຂ່ງຂັນ"
                error={errors.nickname?.message}
              >
                <Input
                  id="nickname"
                  autoComplete="nickname"
                  placeholder="ຕົວຢ່າງ: B-Boy ຊາຍ"
                  aria-invalid={!!errors.nickname}
                  disabled={!hasCategory}
                  {...register('nickname')}
                />
              </FormField>
            </>
          )}

          <FormField
            id="phone"
            label={isDuo ? 'ເບີໂທຕິດຕໍ່ຫຼັກ (ສະມາຊິກທີ 1)' : 'ເບີໂທຕິດຕໍ່'}
            error={errors.phone?.message}
            className={cn(!isDuo && 'sm:col-span-2')}
          >
            <div className="relative">
              <RiPhoneLine
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="020 XXXX XXXX"
                className="pl-9"
                aria-invalid={!!errors.phone}
                disabled={!hasCategory}
                {...register('phone')}
              />
            </div>
          </FormField>
        </CardContent>
      </Card>

      {!hasCategory ? (
        <p className="text-center text-sm text-muted-foreground">
          ກະລຸນາເລືອກໝວດແຂ່ງຂັນກ່ອນກະກອກຂໍ້ມູນ
        </p>
      ) : null}

      {submitError ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col items-center gap-3 sm:items-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || !hasCategory || categoryFull}
          className="w-full shadow-lg shadow-primary/25 sm:w-auto sm:min-w-52"
        >
          {isSubmitting
            ? 'ກຳລັງສົ່ງ...'
            : categoryFull
              ? 'ໝວດນີ້ເຕັມແລ້ວ'
              : 'ສົ່ງໃບສະໝັກ Fanglao Jam'}
        </Button>
        <p className="text-center text-xs text-muted-foreground sm:text-right">
          ຫຼັງສົ່ງແລ້ວ ທີມ Fanglao ຈະຕິດຕໍ່ຢືນຢັນທາງເບີໂທ
        </p>
      </div>
    </form>
      ) : null}
    </>
  )
}
