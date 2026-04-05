'use client'

import {
  RAIL_TRACK_INSET_PCT,
  RAIL_TRACK_INNER_PCT,
  listTimelineMonths,
  railMonthDashStyle,
  railTickPositionStyle,
  timelineFillRatio,
  yearLabelPlacements,
} from '@/lib/kiosk-timeline'
import styles from '@/app/kiosk/kiosk.module.css'
import type { KioskScreen } from '@/lib/kiosk-content'

const timelineMonths = listTimelineMonths()
const yearLabels = yearLabelPlacements()

type Props = {
  screens: KioskScreen[]
  currentIndex: number
  /** Jump to a screen by index (0-based). When set, year ticks are buttons with beacon affordance. */
  onSelectScreen?: (index: number) => void
}

export function TravelerProgressBar({
  screens,
  currentIndex,
  onSelectScreen,
}: Props) {
  const active = screens[currentIndex]
  const ratio = active ? timelineFillRatio(active.timelineAnchor) : 0
  /** Gold fill length matches chronological position on the inner track. */
  const widthPct = `${ratio * RAIL_TRACK_INNER_PCT}%`

  return (
    <div className={styles.railBar} role="presentation">
      <div className={styles.railTrack} aria-hidden />
      <div
        className={styles.railFill}
        style={{ width: widthPct }}
        aria-hidden
      />
      <div className={styles.railMonthTicks} aria-hidden>
        {timelineMonths.map(({ year, month }) => (
          <span
            key={`${year}-${month}`}
            className={styles.railMonthDash}
            style={railMonthDashStyle(year, month)}
          />
        ))}
      </div>
      <div className={styles.railYearLabels} aria-hidden>
        {yearLabels.map(({ year, centerRatio }) => (
          <span
            key={year}
            className={styles.railYearLabel}
            style={{
              left: `calc(${RAIL_TRACK_INSET_PCT}% + ${centerRatio * RAIL_TRACK_INNER_PCT}%)`,
              transform: 'translateX(-50%)',
            }}>
            {year}
          </span>
        ))}
      </div>
      <div className={styles.railTicks}>
        {screens.map((s, i) => {
          const isActive = i === currentIndex
          const tickText = s.timelineTickLabel
          const ariaDate = tickText.replace(/\n/g, ' ')
          const prevAnchor = i === 0 ? null : screens[i - 1].timelineAnchor
          const posStyle = railTickPositionStyle(s.timelineAnchor, prevAnchor)
          if (onSelectScreen) {
            return (
              <button
                key={s.id}
                type="button"
                className={styles.railTickBtn}
                style={posStyle}
                data-active={isActive ? 'true' : 'false'}
                aria-label={`${s.heading} (${ariaDate})`}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => onSelectScreen(i)}>
                <span className={styles.railTickBeacon} aria-hidden />
                <span className={styles.railTickDate}>{tickText}</span>
              </button>
            )
          }
          return (
            <span key={s.id} className={styles.railTick} style={posStyle}>
              <span className={styles.railTickDate}>{tickText}</span>
            </span>
          )
        })}
      </div>
      <div className={styles.railLabels}>
        <span className={styles.railLabelsTitle}>The Iron Road</span>
      </div>
    </div>
  )
}
