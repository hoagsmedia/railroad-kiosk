'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/app/kiosk/kiosk.module.css'
import { useKioskPortalRoot } from '@/lib/use-kiosk-portal-root'
import {
  engineeringLeaderById,
  HART_BLOOMER_SOURCE,
  type EngineeringLeader,
  type EngineeringLeaderId,
} from '@/lib/engineering-leaders'

type Props = {
  leaderId: EngineeringLeaderId
  /** When true, constrain the card width for a single-column layout. */
  singleColumn?: boolean
  /**
   * `laborHorizontal`: portrait left, name / title / years right (Labor screen).
   */
  presentation?: 'default' | 'laborHorizontal'
  /** When false, Labor card uses light motion (parent may still stagger entrance). */
  reduceMotion?: boolean | null
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
  const portalRoot = useKioskPortalRoot()
  const primarySrc = leader?.fieldLogOmitPrimarySource
    ? null
    : (leader?.fieldLogSource ?? HART_BLOOMER_SOURCE)

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
      {open && leader && (
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
              {leader.name}{' '}
              <span className={styles.engineeringFieldLogEpithet}>
                · {leader.epithet}
              </span>
            </h2>
            <section
              className={styles.engineeringFieldLogSection}
              aria-label="Challenge">
              <h3 className={styles.engineeringFieldLogH3}>The challenge</h3>
              {leader.challenge.split(/\n\n+/).map((chunk, i) => (
                <p key={i} className={styles.engineeringFieldLogBody}>
                  {chunk.trim()}
                </p>
              ))}
            </section>
            {primarySrc ? (
              <section
                className={styles.engineeringFieldLogSection}
                aria-label="Primary source">
                <h3 className={styles.engineeringFieldLogH3}>
                  {primarySrc.sectionHeading ??
                    (leader.fieldLogSource
                      ? 'Primary source (survey)'
                      : 'Primary source (shared stereo)')}
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
                    {chunk.trim()}
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
            {leader.fieldLogCoda ? (
              <section
                className={styles.engineeringFieldLogSection}
                aria-label="Why this matters">
                <p className={styles.engineeringFieldLogBody}>
                  {leader.fieldLogCoda}
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
      onHoverEnd={() => setHovered(false)}>
      <div className={styles.architectCardInner}>
        <div className={styles.personFigureRow}>
          <div className={styles.personFigurePhotoCol}>
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
            </motion.div>
          </div>
          <div className={styles.personFigureTextCol}>
            <h3 className={styles.architectName}>{leader.name}</h3>
            <p className={styles.architectEpithet}>{leader.epithet}</p>
            <p className={styles.architectRoleLine}>{leader.roleBadge}</p>
            <p className={styles.architectEra}>{leader.timelineEra}</p>
            <button
              type="button"
              className={styles.architectFieldLogCta}
              onClick={() => onOpen(leader)}
              aria-label={`Open field log for ${leader.name}. Extra detail, challenge, primary source.`}>
              Open field log
              <span className={styles.architectFieldLogCtaHint}>
                More detail and source
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function LaborHorizontalFigureCard({
  leader,
  onOpen,
  reduceMotion,
}: {
  leader: EngineeringLeader
  onOpen: (l: EngineeringLeader) => void
  reduceMotion?: boolean | null
}) {
  const motionOff = Boolean(reduceMotion)
  const [hovered, setHovered] = useState(false)

  return (
    <section
      className={styles.museumLaborFigureCard}
      aria-label="Key figure"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className={styles.museumLaborFigureCardBody}>
        <div className={styles.museumLaborFigureCardRow}>
          <motion.div
            className={styles.museumLaborFigureCardPhoto}
            animate={
              motionOff
                ? { scale: 1 }
                : { scale: hovered ? 1.03 : 1, transition: { duration: 0.35 } }
            }>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leader.imageUrl}
              alt={leader.imageAlt}
              className={styles.museumLaborFigureCardImg}
            />
          </motion.div>
          <div className={styles.museumLaborFigureCardMeta}>
            <h3 className={styles.museumLaborFigureCardName}>{leader.name}</h3>
            <p className={styles.museumLaborFigureCardTitle}>
              {leader.epithet} · {leader.roleBadge}
            </p>
            <p className={styles.museumLaborFigureCardYears}>
              {leader.timelineEra}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.museumLaborFigureFieldLogBtn}
          onClick={() => onOpen(leader)}
          aria-label={`Open field log for ${leader.name}. Extra detail and primary source.`}>
          Open field log
          <span className={styles.museumLaborFigureFieldLogBtnSub}>
            More detail and source
          </span>
        </button>
      </div>
    </section>
  )
}

export function EngineeringLeaderSpotlight({
  leaderId,
  singleColumn = false,
  presentation = 'default',
  reduceMotion: reduceMotionProp,
}: Props) {
  const leader = engineeringLeaderById(leaderId)
  const [fieldLog, setFieldLog] = useState<EngineeringLeader | null>(null)
  const closeLog = useCallback(() => setFieldLog(null), [])

  if (!leader) return null

  if (presentation === 'laborHorizontal') {
    return (
      <>
        <LaborHorizontalFigureCard
          leader={leader}
          onOpen={setFieldLog}
          reduceMotion={reduceMotionProp}
        />
        <EngineeringFieldLogModal
          leader={fieldLog}
          open={fieldLog != null}
          onClose={closeLog}
        />
      </>
    )
  }

  return (
    <>
      <section className={styles.architectsSection} aria-label="Key figure">
        <h2 className={styles.architectsSectionTitle}>Key figure</h2>
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
