import { zodResolver } from '@hookform/resolvers/zod'
import { RiUserLine } from '@remixicon/react'
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
import type { CampClassPublicDTO } from '~/lib/camp-registration-api'
import { submitCampRegistrationFn } from '~/lib/camp-registration.functions'
import {
  campBirthDateBounds,
  campGenderIds,
  campGenderLabels,
  campRegistrationSchema,
  type CampGender,
  type CampRegistrationFormInput,
  type CampRegistrationFormValues,
} from '~/lib/camp-registration'
import { cn } from '~/lib/utils'
import { CampClassSelector } from './CampClassSelector'
import { CampRegistrationSuccess } from './CampRegistrationSuccess'

function FormField({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type SuccessState = {
  registrationId: string
  data: CampRegistrationFormValues
}

export function CampRegistrationForm({
  classes,
  defaultClassTypeIds = [],
}: {
  classes: CampClassPublicDTO[]
  defaultClassTypeIds?: string[]
}) {
  const [success, setSuccess] = React.useState<SuccessState | null>(null)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<
    CampRegistrationFormInput,
    unknown,
    CampRegistrationFormValues
  >({
    resolver: zodResolver(campRegistrationSchema),
    defaultValues: {
      fullName: '',
      nickname: '',
      dateOfBirth: '',
      gender: undefined,
      genderOther: '',
      phone: '',
      classTypeIds: defaultClassTypeIds,
    },
  })

  const selectedGender = watch('gender')

  const classLabelById = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const item of classes) {
      map.set(item.classTypeId, item.labelLao || item.name)
    }
    return map
  }, [classes])

  const onSubmit = async (data: CampRegistrationFormValues) => {
    setSubmitError(null)

    const result = await submitCampRegistrationFn({
      data: {
        fullName: data.fullName,
        nickname: data.nickname,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        genderOther: data.genderOther,
        phoneNumber: data.phone,
        classTypeIds: data.classTypeIds,
      },
    })

    if (!result.ok) {
      trackGaEvent('camp_register_error', {
        error_code: result.code ?? 'UNKNOWN',
      })

      if (result.code === 'NETWORK') {
        setSubmitError('ບໍ່ສາມາດເຊື່ອມຕໍ່ໄດ້ — ກະລຸນາລອງໃໝ່ອີກຄັ້ງ')
        return
      }
      if (result.code === 'EVENT_NOT_OPEN') {
        setSubmitError('ປິດຮັບລົງທະບຽນແລ້ວ')
        return
      }
      if (result.code === 'AGE_OUT_OF_RANGE') {
        setSubmitError('ອາຍຸບໍ່ຢູ່ໃນໄລຍະທີ່ກຳນົດ')
        return
      }
      if (result.code === 'INVALID_CLASS') {
        setSubmitError('ຄລາສທີ່ເລືອກບໍ່ຖືກຕ້ອງ — ກະລຸນາໂຫຼດໜ້າໃໝ່')
        return
      }
      setSubmitError('ສົ່ງແບບຟອມບໍ່ສຳເລັດ — ກະລຸນາລອງໃໝ່')
      return
    }

    trackGaEvent('camp_register_submit', {
      class_count: data.classTypeIds.length,
      classes: data.classTypeIds.join(','),
    })

    setSuccess({
      registrationId: result.data.registrationId,
      data,
    })
  }

  const handleRegisterAgain = () => {
    setSuccess(null)
    reset({
      fullName: '',
      nickname: '',
      dateOfBirth: '',
      gender: undefined,
      genderOther: '',
      phone: '',
      classTypeIds: defaultClassTypeIds,
    })
  }

  return (
    <>
      {success ? (
        <CampRegistrationSuccess
          registrationId={success.registrationId}
          data={success.data}
          classLabels={success.data.classTypeIds.map(
            (id) => classLabelById.get(id) ?? id,
          )}
          onRegisterAgain={handleRegisterAgain}
        />
      ) : null}

      {!success ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8"
    >
      <Card className="bg-card/80">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <RiUserLine size={20} />
            </div>
            <div>
              <CardTitle className="font-heading text-lg uppercase">
                ຂໍ້ມູນສ່ວນຕົວ
              </CardTitle>
              <CardDescription>
                ສຳລັບຜູ້ສະໝັກທົ່ວໄປ · Summer Dance Camp 2026
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
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
              {...register('fullName')}
            />
          </FormField>

          <FormField
            id="nickname"
            label="ຊື່ຫຼິ້ນ"
            error={errors.nickname?.message}
          >
            <Input
              id="nickname"
              autoComplete="nickname"
              placeholder="ຕົວຢ່າງ: ຊາຍ"
              aria-invalid={!!errors.nickname}
              {...register('nickname')}
            />
          </FormField>

          <FormField
            id="dateOfBirth"
            label="ວັນເດືອນປີເກີດ"
            error={errors.dateOfBirth?.message}
          >
            <Input
              id="dateOfBirth"
              type="date"
              min={campBirthDateBounds.min}
              max={campBirthDateBounds.max}
              aria-invalid={!!errors.dateOfBirth}
              {...register('dateOfBirth')}
            />
          </FormField>

          <FormField
            id="gender"
            label="ເພດ"
            error={errors.gender?.message}
            className="sm:col-span-2"
          >
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2">
                    {campGenderIds.map((genderId) => {
                      const selected = field.value === genderId

                      return (
                        <button
                          key={genderId}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            field.onChange(genderId as CampGender)
                            if (genderId !== 'other') {
                              setValue('genderOther', '', { shouldValidate: true })
                            }
                          }}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 outline-none',
                            'focus-visible:ring-3 focus-visible:ring-ring/50',
                            selected
                              ? 'border-primary bg-primary/15 text-primary shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_25%,transparent)]'
                              : 'border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                          )}
                        >
                          {campGenderLabels[genderId]}
                        </button>
                      )
                    })}
                  </div>

                  {selectedGender === 'other' ? (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="genderOther" className="text-muted-foreground">
                        ລະບຸເພດ
                      </Label>
                      <Input
                        id="genderOther"
                        placeholder="ຕົວຢ່າງ: Non-binary, Prefer not to say"
                        aria-invalid={!!errors.genderOther}
                        {...register('genderOther')}
                      />
                      {errors.genderOther?.message ? (
                        <p className="text-sm text-destructive" role="alert">
                          {errors.genderOther.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}
            />
          </FormField>

          <FormField
            id="phone"
            label="ເບີໂທຕິດຕໍ່"
            error={errors.phone?.message}
            className="sm:col-span-2"
          >
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="020 XXXX XXXX"
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
          </FormField>
        </CardContent>
      </Card>

      <Card className="bg-card/80">
        <CardHeader>
          <CardTitle className="font-heading text-lg uppercase">
            ເລືອກຄລາສ
          </CardTitle>
          <CardDescription>
            ຈິ້ມເລືອກສไตล์ເຕັ້ນທີ່ຕ້ອງການ — ເລືອກໄດ້ຫຼາຍກວ່າ 1 ຄລາສ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="classTypeIds"
            control={control}
            render={({ field }) => (
              <CampClassSelector
                classes={classes}
                value={field.value}
                onChange={field.onChange}
                error={errors.classTypeIds?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </CardContent>
      </Card>

      {submitError ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex justify-center sm:justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full shadow-lg shadow-primary/25 sm:w-auto sm:min-w-48"
        >
          {isSubmitting ? 'ກຳລັງສົ່ງ...' : 'ສົ່ງແບບຟອມລົງທະບຽນ'}
        </Button>
      </div>
    </form>
      ) : null}
    </>
  )
}
