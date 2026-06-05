import { Link } from '@tanstack/react-router'
import { RiCalendarLine, RiPlayCircleLine } from '@remixicon/react'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import type { CampStyle } from '~/lib/camp-styles'

export function StylePreviewDialog({
  style,
  open,
  onOpenChange,
}: {
  style: CampStyle | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [videoFailed, setVideoFailed] = React.useState(false)
  const lastStyleRef = React.useRef<CampStyle | null>(null)

  if (style) {
    lastStyleRef.current = style
  }

  const displayedStyle = style ?? lastStyleRef.current

  React.useEffect(() => {
    setVideoFailed(false)
  }, [displayedStyle?.id])

  if (!displayedStyle) return null

  const Icon = displayedStyle.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-primary/20 p-0 sm:max-w-2xl">
        <div className="relative aspect-video w-full overflow-hidden bg-card">
          {!videoFailed ? (
            <video
              key={displayedStyle.id}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="size-full object-cover"
              onError={() => setVideoFailed(true)}
            >
              <source src={displayedStyle.previewVideoSrc} type="video/mp4" />
            </video>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-3 bg-card px-6 text-center">
              <RiPlayCircleLine size={48} className="text-primary" />
              <p className="text-sm text-muted-foreground">
                ວິດີໂອຕົວຢ່າງຈະເພີ່ມໃນໄວໆນີ້
              </p>
              <img
                src={displayedStyle.photoSrc}
                alt=""
                className="max-h-40 object-contain opacity-80"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 p-5 md:p-6">
          <DialogHeader className="gap-3">
            <div className="flex items-center gap-3 text-primary">
              <Icon size={24} />
              <DialogTitle className="font-heading text-xl font-bold uppercase tracking-wide">
                {displayedStyle.name}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-foreground">
              {displayedStyle.lao} · {displayedStyle.tagline}
            </DialogDescription>
            <p className="text-sm text-muted-foreground">{displayedStyle.description}</p>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
              <RiCalendarLine size={18} />
              <span>ຕາຕະລາງເວລາຮຽນ</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">ວັນ</th>
                    <th className="px-4 py-3 font-semibold">ເວລາ</th>
                    <th className="px-4 py-3 font-semibold">ກຸ່ມ</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedStyle.timeSlots.map((slot) => (
                    <tr key={`${slot.days}-${slot.time}`} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{slot.days}</td>
                      <td className="px-4 py-3 text-primary">{slot.time}</td>
                      <td className="px-4 py-3 text-muted-foreground">{slot.group}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">{displayedStyle.schedule}</p>
          </div>

          <Button className="shadow-lg shadow-primary/25" asChild>
            <Link
              to="/register/camp"
              search={{ class: displayedStyle.id }}
              onClick={() => onOpenChange(false)}
            >
              ລົງທະບຽນ {displayedStyle.name}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
