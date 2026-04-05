'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import {
  engineeringLeaderById,
  HART_BLOOMER_SOURCE,
  type EngineeringLeader,
  type EngineeringLeaderId,
} from '@/lib/engineering-leaders'

type Props = {
  leaderId: EngineeringLeaderId
  /** Section `<h2>`; defaults to “Leadership spotlight”. */
  sectionHeading?: string
  /** When true, constrain the card width for a single-column layout (Cause / Labor). */
  singleColumn?: boolean
}

function EngineeringFieldLogModal({
  leader,
  open,
  onClose,
}: {
  leader: EngineeringLeader | null
  open: boolean
  onClose: () => void
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const src = leader?.fieldLogSource ?? HART_BLOOMER_SOURCE

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

  return (
    <AnimatePresence>
      {open && leader && (
        <motion.div
          className={styles.modalBackdrop}
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
              {leader.name}{' '}
              <span className={styles.engineeringFieldLogEpithet}>
                — {leader.epithet}
              </span>
            </h2>
            <section
              className={styles.engineeringFieldLogSection}
              aria-label="Challenge">
              <h3 className={styles.engineeringFieldLogH3}>The challenge</h3>
              <p className={styles.engineeringFieldLogBody}>
                {leader.challenge}
              </p>
            </section>
            <section
              className={styles.engineeringFieldLogSection}
              aria-label="Primary source">
              <h3 className={styles.engineeringFieldLogH3}>
                {leader.fieldLogSource
                  ? 'Primary source — survey'
                  : 'Primary source — shared engineering feat'}
              </h3>
              <p className={styles.engineeringFieldLogMeta}>
                {src.shortLabel}
                {src.year ? ` (${src.year})` : ''}
              </p>
              <div className={styles.engineeringFieldLogScan}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src.imageUrl} alt={src.imageAlt} />
              </div>
              <p className={styles.engineeringFieldLogSnippet}>
                {src.transcript}
              </p>
              {src.archiveUrl && src.archiveName ? (
                <a
                  href={src.archiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineArchiveLink}>
                  Open at {src.archiveName} ↗
                </a>
              ) : null}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ArchitectCard({
  leader,
  onOpen,
}: {
  leader: EngineeringLeader
  onOpen: (l: EngineeringLeader) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      className={styles.architectCard}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.985 }}>
      <button
        type="button"
        className={styles.architectCardBtn}
        onClick={() => onOpen(leader)}
        aria-label={`Open field log: ${leader.name}, ${leader.epithet}`}>
        <motion.div
          className={styles.architectPhotoFrame}
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={leader.imageUrl}
            alt={leader.imageAlt}
            className={styles.architectPhoto}
          />
          <motion.div
            className={styles.architectRoleBadge}
            initial={false}
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 8,
            }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
            {leader.roleBadge}
          </motion.div>
        </motion.div>
        <h3 className={styles.architectName}>{leader.name}</h3>
        <p className={styles.architectEpithet}>{leader.epithet}</p>
        <p className={styles.architectEra}>{leader.timelineEra}</p>
      </button>
    </motion.article>
  )
}

export function EngineeringLeaderSpotlight({
  leaderId,
  sectionHeading = 'Leadership spotlight',
  singleColumn = false,
}: Props) {
  const leader = engineeringLeaderById(leaderId)
  const [fieldLog, setFieldLog] = useState<EngineeringLeader | null>(null)
  const closeLog = useCallback(() => setFieldLog(null), [])

  if (!leader) return null

  return (
    <>
      <section className={styles.architectsSection} aria-label={sectionHeading}>
        <h2 className={styles.architectsSectionTitle}>{sectionHeading}</h2>
        <div
          className={
            singleColumn
              ? `${styles.architectGrid} ${styles.architectGridSingle}`
              : styles.architectGrid
          }>
          <ArchitectCard leader={leader} onOpen={setFieldLog} />
        </div>
      </section>
      <EngineeringFieldLogModal
        leader={fieldLog}
        open={fieldLog != null}
        onClose={closeLog}
      />
    </>
  )
}
