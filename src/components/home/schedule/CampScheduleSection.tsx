import { Link } from '@tanstack/react-router'
import * as React from 'react'
import { Button } from '~/components/ui/button'
import {
  scheduleByTab,
  scheduleTabs,
  type ScheduleTabId,
} from '~/lib/camp-schedule'
import { EventDayTimeline } from './EventDayTimeline'
import { WeekGrid } from './WeekGrid'
import { WeekTabs } from './WeekTabs'

export function CampScheduleSection() {
  const [activeTab, setActiveTab] = React.useState<ScheduleTabId>('week1')
  const [direction, setDirection] = React.useState<1 | -1>(1)
  const prevIndexRef = React.useRef(0)

  const handleTabChange = (tabId: ScheduleTabId) => {
    const nextIndex = scheduleTabs.findIndex((tab) => tab.id === tabId)
    const prevIndex = prevIndexRef.current
    setDirection(nextIndex >= prevIndex ? 1 : -1)
    prevIndexRef.current = nextIndex
    setActiveTab(tabId)
  }

  const activeTabMeta = scheduleTabs.find((tab) => tab.id === activeTab)
  const isEventDay = activeTab === 'event-day'

  return (
    <section
      id="camp-schedule"
      aria-labelledby="camp-schedule-heading"
      className="camp-schedule-section relative scroll-mt-18 overflow-hidden border-t border-border px-4 py-12 sm:py-16 md:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 camp-schedule-section-bg"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8 md:gap-10">
        <header className="flex flex-col gap-2 text-center">
          <h2
            id="camp-schedule-heading"
            className="font-heading text-xl font-bold uppercase tracking-tight sm:text-2xl md:text-3xl"
          >
            Camp Schedule
          </h2>
          <p className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm">
            ຕາຕະລາງຮຽນປະຈຳອາທິດຂອງ Summer Dance Camp
          </p>
          {activeTabMeta ? (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-primary sm:text-xs">
              {activeTabMeta.dateRange}
            </p>
          ) : null}
        </header>

        <WeekTabs
          tabs={scheduleTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div
          id={`schedule-panel-${activeTab}`}
          aria-labelledby={`schedule-tab-${activeTab}`}
        >
          {isEventDay ? (
            <EventDayTimeline direction={direction} />
          ) : (
            <WeekGrid
              days={scheduleByTab[activeTab]}
              direction={direction}
              tabId={activeTab}
            />
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Button
            size="lg"
            className="shadow-xl shadow-primary/25"
            asChild
          >
            <Link to="/register/camp">ລົງທະບຽນ Summer Camp</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
