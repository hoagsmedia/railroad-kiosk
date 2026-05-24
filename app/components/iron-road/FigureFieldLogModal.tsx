'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/app/kiosk/kiosk.module.css'
import { formatKioskBodySegment } from '@/lib/format-kiosk-body'
import type { EngineeringFieldLogSource } from '@/lib/engineering-leaders'
import { useKioskPortalRoot } from '@/lib/use-kiosk-portal-root'

export type FigureFieldLogProfile = {
  name: string
  epithet: string
  challenge: string
  fieldLogSource?: EngineeringFieldLogSource
  fieldLogOmitPrimarySource?: boolean
  fieldLogCoda?: string
}

type Props = {
  profile: FigureFieldLogProfile | null
  open: boolean
  onClose: () => void
  /** Used when the profile has no dedicated primary source (e.g. Dodge field log). */
  fallbackPrimarySource?: EngineeringFieldLogSource | null
}

export function FigureFieldLogModal({
  profile,
  open,
  onClose,
  fallbackPrimarySource = null,
}: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const portalRoot = useKioskPortalRoot()
  const primarySrc = profile?.fieldLogOmitPrimarySource
    ? null
    : (profile?.fieldLogSource ?? fallbackPrimarySource ?? null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!portalRoot) return null

  return createPortal(
    <AnimatePresence>
      {open && profile && (
        <motion.div
          className={`${styles.modalBackdrop} ${styles.engineeringFieldLogBackdrop}`}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseDown={e => {
            if (e.target === e.currentTarget) onClose()
          }}>
          <motion.div
            ref={panelRef}
            className={styles.engineeringFieldLogPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 20, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 12, rotateX: 4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close field log">
              ×
            </button>
            <p className={styles.engineeringFieldLogKicker}>Field log</p>
            <h2 id={titleId} className={styles.engineeringFieldLogTitle}>
              {profile.name}{' '}
              <span className={styles.engineeringFieldLogEpithet}>
                · {profile.epithet}
              </span>
            </h2>
            <section
              className={styles.engineeringFieldLogSection}
              aria-label="Challenge">
              <h3 className={styles.engineeringFieldLogH3}>The challenge</h3>
              {profile.challenge.split(/\n\n+/).map((chunk, i) => (
                <p key={i} className={styles.engineeringFieldLogBody}>
                  {formatKioskBodySegment(chunk.trim())}
                </p>
              ))}
            </section>
            {primarySrc ? (
              <section
                className={styles.engineeringFieldLogSection}
                aria-label="Primary source">
                <h3 className={styles.engineeringFieldLogH3}>
                  {primarySrc.sectionHeading ??
                    (profile.fieldLogSource
                      ? 'Primary source (survey)'
                      : 'Primary source')}
                </h3>
                <p className={styles.engineeringFieldLogMeta}>
                  {primarySrc.shortLabel}
                  {primarySrc.year ? ` (${primarySrc.year})` : ''}
                </p>
                {primarySrc.horizontalScroll ? (
                  <p
                    className={styles.engineeringFieldLogScrollHint}
                    aria-hidden>
                    Scroll sideways to follow the map
                  </p>
                ) : null}
                <div
                  className={
                    primarySrc.horizontalScroll
                      ? `${styles.engineeringFieldLogScan} ${styles.engineeringFieldLogScanWide}`
                      : styles.engineeringFieldLogScan
                  }>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={primarySrc.imageUrl} alt={primarySrc.imageAlt} />
                </div>
                {primarySrc.transcript.split(/\n\n+/).map((chunk, i) => (
                  <p key={i} className={styles.engineeringFieldLogSnippet}>
                    {formatKioskBodySegment(chunk.trim())}
                  </p>
                ))}
                {primarySrc.archiveUrl && primarySrc.archiveName ? (
                  <a
                    href={primarySrc.archiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.inlineArchiveLink}>
                    Open at {primarySrc.archiveName} ↗
                  </a>
                ) : null}
              </section>
            ) : null}
            {profile.fieldLogCoda ? (
              <section
                className={styles.engineeringFieldLogSection}
                aria-label="Why this matters">
                <p className={styles.engineeringFieldLogBody}>
                  {formatKioskBodySegment(profile.fieldLogCoda)}
                </p>
              </section>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  )
}
