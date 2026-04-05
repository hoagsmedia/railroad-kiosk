import type { CSSProperties } from 'react'

/**
 * Rail timeline: Jul 1862 → 10 May 1869. The bar is divided into **equal-width
 * month columns** (83 months); the gold fill advances by day within each column.
 * May 1869 uses only the first 10 days mapped across that column so the end date
 * matches Promontory / “Done.”
 */
const START_YEAR = 1862
const START_MONTH = 7 // July
const END_YEAR = 1869
const END_MONTH = 5
const END_DAY = 10

/** Inclusive month count from Jul 1862 through May 1869. */
export const TIMELINE_MONTH_COUNT = 83

export type TimelineAnchor = {
  year: number
  month: number
  day: number
}

/** Match CSS: track and fill use this inset; inner span is 100% − 2×inset. */
export const RAIL_TRACK_INSET_PCT = 4
export const RAIL_TRACK_INNER_PCT = 100 - 2 * RAIL_TRACK_INSET_PCT

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** 0 = July 1862, 82 = May 1869. */
export function monthIndexFromStart(year: number, month: number): number {
  return (year - START_YEAR) * 12 + (month - START_MONTH)
}

/**
 * [0, 1] on the rail: equal width per calendar month column; sub-month progress
 * by day; May 1869 column spans only days 1–10 to the right edge.
 */
export function timelineFillRatio(anchor: TimelineAnchor): number {
  const idx = monthIndexFromStart(anchor.year, anchor.month)
  if (idx < 0) return 0
  if (idx > TIMELINE_MONTH_COUNT - 1) return 1

  const isMay1869 = anchor.year === END_YEAR && anchor.month === END_MONTH
  const dim = daysInMonth(anchor.year, anchor.month)
  const day = isMay1869
    ? Math.min(Math.max(anchor.day, 1), END_DAY)
    : anchor.day
  /** May maps 10 days across the last column so 10 May hits the rail end; other months use full calendar length. */
  const dayFrac = isMay1869
    ? (day - 1) / (END_DAY - 1)
    : dim > 1
      ? (day - 1) / dim
      : 0

  return Math.min(1, Math.max(0, (idx + dayFrac) / TIMELINE_MONTH_COUNT))
}

export type TimelineMonthMark = { year: number; month: number }

/** Every calendar month on the rail, July 1862 → May 1869. */
export function listTimelineMonths(): TimelineMonthMark[] {
  const out: TimelineMonthMark[] = []
  let y = START_YEAR
  let m = START_MONTH
  while (y < END_YEAR || (y === END_YEAR && m <= END_MONTH)) {
    out.push({ year: y, month: m })
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return out
}

/** Left ratio [0,1] for the **start** of each month column (83 dashes). */
export function monthStartRatio(year: number, month: number): number {
  const idx = monthIndexFromStart(year, month)
  if (idx < 0) return 0
  if (idx >= TIMELINE_MONTH_COUNT) return 1
  return idx / TIMELINE_MONTH_COUNT
}

export type YearLabelPlacement = { year: number; centerRatio: number }

/**
 * Center of each calendar year **on the month-column scale**: midpoint between
 * the start of the first month of that year on the rail and the end of the last.
 */
export function yearLabelPlacements(): YearLabelPlacement[] {
  const months = listTimelineMonths()
  const byYear = new Map<number, { minIdx: number; maxIdx: number }>()
  for (const { year, month } of months) {
    const idx = monthIndexFromStart(year, month)
    const cur = byYear.get(year)
    if (!cur) {
      byYear.set(year, { minIdx: idx, maxIdx: idx })
    } else {
      cur.minIdx = Math.min(cur.minIdx, idx)
      cur.maxIdx = Math.max(cur.maxIdx, idx)
    }
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => a - b)
    .map(([year, { minIdx, maxIdx }]) => ({
      year,
      centerRatio: (minIdx + maxIdx + 1) / 2 / TIMELINE_MONTH_COUNT,
    }))
}

/**
 * Inline `left` + `transform` so a tick sits on the same date scale as the gold fill.
 * `xNudgePx` separates a screen from the previous one when they share the same calendar anchor.
 */
export function railTickPositionStyle(
  anchor: TimelineAnchor,
  prevAnchor: TimelineAnchor | null
): CSSProperties {
  const r = timelineFillRatio(anchor)
  const duplicatePrev =
    prevAnchor != null &&
    prevAnchor.year === anchor.year &&
    prevAnchor.month === anchor.month &&
    prevAnchor.day === anchor.day
  const xNudgePx = duplicatePrev ? 18 : 0
  return {
    left: `calc(${RAIL_TRACK_INSET_PCT}% + ${r * RAIL_TRACK_INNER_PCT}%)`,
    transform: `translateX(calc(-50% + ${xNudgePx}px))`,
  }
}

/** `left` for a month dash (center of tick) on the inner track. */
export function railMonthDashStyle(year: number, month: number): CSSProperties {
  const idx = monthIndexFromStart(year, month)
  if (idx < 0 || idx >= TIMELINE_MONTH_COUNT)
    return { left: '0%', transform: 'translateX(-50%)' }
  const centerRatio = (idx + 0.5) / TIMELINE_MONTH_COUNT
  return {
    left: `calc(${RAIL_TRACK_INSET_PCT}% + ${centerRatio * RAIL_TRACK_INNER_PCT}%)`,
    transform: 'translateX(-50%)',
  }
}
