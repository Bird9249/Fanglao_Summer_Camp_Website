import * as React from 'react'
import { cn } from '~/lib/utils'
import type { ScheduleTab, ScheduleTabId } from '~/lib/camp-schedule'

type WeekTabsProps = {
  tabs: ScheduleTab[]
  activeTab: ScheduleTabId
  onTabChange: (tabId: ScheduleTabId) => void
}

export function WeekTabs({ tabs, activeTab, onTabChange }: WeekTabsProps) {
  const tabRefs = React.useRef<Partial<Record<ScheduleTabId, HTMLButtonElement>>>(
    {},
  )

  const focusTab = (tabId: ScheduleTabId) => {
    tabRefs.current[tabId]?.focus()
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const nextIndex = (index + delta + tabs.length) % tabs.length
    const nextTab = tabs[nextIndex]
    onTabChange(nextTab.id)
    focusTab(nextTab.id)
  }

  return (
    <div
      role="tablist"
      aria-label="Camp schedule weeks"
      className="schedule-tabs-track -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0"
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            ref={(node) => {
              if (node) tabRefs.current[tab.id] = node
            }}
            type="button"
            role="tab"
            id={`schedule-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`schedule-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'schedule-tab shrink-0 rounded-lg border px-3 py-2.5 text-left sm:min-w-[9.5rem] sm:px-4 sm:py-3',
              'border-border/50 bg-card/40 text-muted-foreground backdrop-blur-sm',
              'hover:border-chart-5/40 hover:text-foreground',
              isActive && 'schedule-tab--active border-chart-5/50 bg-card/70',
              tab.isEventDay &&
                'border-destructive/30 hover:border-destructive/50',
              tab.isEventDay && isActive && 'border-destructive/55',
              tab.isEventDay && 'schedule-tab--event',
            )}
          >
            <span className="block font-heading text-[0.65rem] font-bold uppercase tracking-wide sm:text-xs">
              {tab.label}
            </span>
            <span className="mt-0.5 block text-[0.6rem] text-muted-foreground sm:text-[0.65rem]">
              {tab.labelLao}
            </span>
            <span className="mt-1 block text-[0.55rem] uppercase tracking-wider text-primary/80 sm:text-[0.6rem]">
              {tab.dateRange}
            </span>
          </button>
        )
      })}
    </div>
  )
}
