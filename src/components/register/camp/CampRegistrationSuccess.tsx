import { RiCheckLine, RiSparklingFill } from '@remixicon/react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  formatBirthDateLao,
  formatGenderDisplay,
  type CampRegistrationFormValues,
} from '~/lib/camp-registration'

type CampRegistrationSuccessProps = {
  registrationId: string
  data: CampRegistrationFormValues
  classLabels: string[]
  onRegisterAgain: () => void
}

const BURST_PARTICLES = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  angle: (360 / 42) * index + (index % 5) * 4,
  distance: `${24 + (index % 8) * 7}vmin`,
  size: 6 + (index % 5) * 5,
  delay: `${(index % 7) * 0.025}s`,
  variant: index % 3,
}))

const BURST_RAYS = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  angle: (360 / 16) * index,
  delay: `${index * 0.03}s`,
}))

export function CampRegistrationSuccess({
  registrationId,
  data,
  classLabels,
  onRegisterAgain,
}: CampRegistrationSuccessProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className="camp-reg-success-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="camp-reg-success-title"
    >
      <div className="camp-reg-success-burst" aria-hidden>
        <div className="camp-reg-success-flash" />
        <div className="camp-reg-success-flash camp-reg-success-flash--delayed" />
        <div className="camp-reg-success-glow" />

        {BURST_RAYS.map((ray) => (
          <span
            key={ray.id}
            className="camp-reg-success-ray"
            style={
              {
                '--angle': `${ray.angle}deg`,
                '--delay': ray.delay,
              } as React.CSSProperties
            }
          />
        ))}

        <span className="camp-reg-success-ring" style={{ '--delay': '0s' } as React.CSSProperties} />
        <span
          className="camp-reg-success-ring camp-reg-success-ring--gold"
          style={{ '--delay': '0.08s' } as React.CSSProperties}
        />
        <span
          className="camp-reg-success-ring camp-reg-success-ring--purple"
          style={{ '--delay': '0.16s' } as React.CSSProperties}
        />

        {BURST_PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className={[
              'camp-reg-success-particle',
              particle.variant === 0
                ? 'camp-reg-success-particle--gold'
                : particle.variant === 1
                  ? 'camp-reg-success-particle--purple'
                  : 'camp-reg-success-particle--mixed',
            ].join(' ')}
            style={
              {
                '--angle': `${particle.angle}deg`,
                '--dist': particle.distance,
                '--size': `${particle.size}px`,
                '--delay': particle.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="camp-reg-success-panel">
        <Card className="camp-reg-success-card border-primary/35 bg-card/95 shadow-2xl shadow-primary/15 backdrop-blur-md">
          <CardHeader className="px-6 pb-2">
            <div className="flex w-full flex-col items-center text-center">
              <div className="camp-reg-success-icon mb-3 flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary ring-4 ring-primary/25">
                <RiCheckLine className="size-9 shrink-0" aria-hidden />
              </div>
              <p className="mb-2 inline-flex items-center justify-center gap-2 text-primary">
                <RiSparklingFill className="size-3.5 shrink-0" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Summer Camp 2026
                </span>
                <RiSparklingFill className="size-3.5 shrink-0" aria-hidden />
              </p>
              <CardTitle
                id="camp-reg-success-title"
                className="w-full text-center font-heading text-2xl uppercase"
              >
                ສົ່ງແບບຟອມສຳເລັດ!
              </CardTitle>
              <CardDescription className="mt-2 max-w-md text-center text-base">
                ຂໍຂອບໃຈທີ່ສະໝັກ Summer Dance Camp — ທີມງານຈະຕິດຕໍ່ກັບຄືນໃນໄວໆນີ້
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-center">
              <p className="font-semibold text-amber-800 dark:text-amber-300">
                ສະຖານະ: ລໍຖ້າທີມຕິດຕໍ່
              </p>
              <p className="mt-2 text-muted-foreground text-xs leading-relaxed">
                ທີມ Fanglao Studio ຈະໂທຫຼືຕິດຕໍ່ກັບຄືນເພື່ອຢືນຢັນການເຂົ້າຮ່ວມ — ຍັງບໍ່ມີ Digital
                Pass ສຳລັບ Camp (ຈະໃຊ້ Check-in ທີ່ສະຕູດິໂອຫຼັງລົງທະບຽນແລ້ວ)
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ລະຫັດອ້າງອິງ
              </p>
              <p className="font-mono text-xl font-bold text-primary">
                {registrationId}
              </p>
              <p className="mt-1 text-muted-foreground text-xs">
                ກະລຸນາເກັບລະຫັດນີ້ໄວ້ເວລາຕິດຕໍ່ທີມງານ
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <p>
                <span className="text-muted-foreground">ຊື່:</span>{' '}
                <span className="font-medium">{data.fullName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">ຊື່ຫຼິ້ນ:</span>{' '}
                <span className="font-medium">{data.nickname}</span>
              </p>
              <p>
                <span className="text-muted-foreground">ວັນເດືອນປີເກີດ:</span>{' '}
                <span className="font-medium">
                  {formatBirthDateLao(data.dateOfBirth)}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">ອາຍຸ:</span>{' '}
                <span className="font-medium">{data.age} ປີ</span>
              </p>
              <p>
                <span className="text-muted-foreground">ເພດ:</span>{' '}
                <span className="font-medium">{formatGenderDisplay(data)}</span>
              </p>
              <p>
                <span className="text-muted-foreground">ຄລາສ:</span>{' '}
                <span className="font-medium">{classLabels.join(', ')}</span>
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onRegisterAgain}
            >
              ກອກແບບຟອມໃໝ່
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>,
    document.body,
  )
}
