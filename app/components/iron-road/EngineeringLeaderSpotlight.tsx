'use client'

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import { FigureFieldLogModal } from '@/app/components/iron-road/FigureFieldLogModal'
import {
  engineeringLeaderById,
  HART_BLOOMER_SOURCE,
  type EngineeringLeader,
  type EngineeringLeaderId,
} from '@/lib/engineering-leaders'

function leaderFieldLogProfile(
  leader: EngineeringLeader
): {
  name: string
  epithet: string
  challenge: string
  fieldLogSource?: EngineeringLeader['fieldLogSource']
  fieldLogOmitPrimarySource?: boolean
  fieldLogCoda?: string
} {
  return {
    name: leader.name,
    epithet: leader.epithet,
    challenge: leader.challenge,
    fieldLogSource: leader.fieldLogSource,
    fieldLogOmitPrimarySource: leader.fieldLogOmitPrimarySource,
    fieldLogCoda: leader.fieldLogCoda,
  }
}

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
        <FigureFieldLogModal
          profile={fieldLog ? leaderFieldLogProfile(fieldLog) : null}
          open={fieldLog != null}
          onClose={closeLog}
          fallbackPrimarySource={HART_BLOOMER_SOURCE}
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
      <FigureFieldLogModal
        profile={fieldLog ? leaderFieldLogProfile(fieldLog) : null}
        open={fieldLog != null}
        onClose={closeLog}
        fallbackPrimarySource={HART_BLOOMER_SOURCE}
      />
    </>
  )
}
