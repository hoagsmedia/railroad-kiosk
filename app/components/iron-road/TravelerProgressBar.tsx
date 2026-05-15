'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import type { KioskScreen } from '@/lib/kiosk-content'

type Props = {
  screens: KioskScreen[]
  currentIndex: number
  /** Jump to a screen by index (0-based). When set, year ticks are buttons with beacon affordance. */
  onSelectScreen?: (index: number) => void
}

/** Minimum width per stop so labels rarely collide; strip grows wider than the viewport → horizontal scroll. */
const REM_PER_STOP = 6.25

export function TravelerProgressBar({
  screens,
  currentIndex,
  onSelectScreen,
}: Props) {
  const tickRefs = useRef<Array<HTMLButtonElement | HTMLSpanElement | null>>([])
  const n = Math.max(1, screens.length)
  /** Right edge of gold aligns with the active tick (same center as stops at (i+0.5)/n). */
  const fillPct = ((currentIndex + 0.5) / n) * 100

  useEffect(() => {
    const el = tickRefs.current[currentIndex]
    if (!el) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const run = () =>
      el.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: reduced ? 'auto' : 'smooth',
      })
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(run)
    })
    return () => cancelAnimationFrame(id)
  }, [currentIndex])

  const tickStyle = (i: number): CSSProperties => ({
    left: `${((i + 0.5) / n) * 100}%`,
    transform: 'translateX(-50%)',
  })

  return (
    <div className={styles.railBar} role="presentation">
      <div className={styles.railScrollViewport}>
        <div className={styles.railScroll}>
          <div
            className={styles.railScrollInner}
            style={{
              minWidth: `max(100%, calc(${n} * ${REM_PER_STOP}rem))`,
            }}>
            <div className={styles.railTrackStrip} aria-hidden>
              <div className={styles.railTrack} />
              <div
                className={styles.railFill}
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <div className={styles.railTicksLayer}>
              {screens.map((s, i) => {
                const isActive = i === currentIndex
                const tickText = s.timelineTickLabel
                const ariaDate = tickText.replace(/\n/g, ' ')
                const posStyle = tickStyle(i)
                const refCb = (el: HTMLButtonElement | HTMLSpanElement | null) => {
                  tickRefs.current[i] = el
                }
                if (onSelectScreen) {
                  return (
                    <button
                      key={s.id}
                      ref={refCb}
                      type="button"
                      className={styles.railTickBtn}
                      style={posStyle}
                      data-active={isActive ? 'true' : 'false'}
                      aria-label={`${s.heading} (${ariaDate})`}
                      aria-current={isActive ? 'step' : undefined}
                      onClick={() => onSelectScreen(i)}>
                      <span className={styles.railTickDate}>{tickText}</span>
                      <span className={styles.railTickBeacon} aria-hidden />
                    </button>
                  )
                }
                return (
                  <span
                    key={s.id}
                    ref={refCb}
                    className={styles.railTick}
                    style={posStyle}>
                    <span className={styles.railTickDate}>{tickText}</span>
                    <span className={styles.railTickBeacon} aria-hidden />
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.railLabels}>
        <span className={styles.railLabelsTitle}>The Iron Road</span>
        <span className={styles.railLabelsEra}>1861–1869</span>
      </div>
    </div>
  )
}
