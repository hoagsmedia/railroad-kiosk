'use client'

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import { FigureFieldLogModal } from '@/app/components/iron-road/FigureFieldLogModal'
import type { KioskKeyFigureProfile } from '@/lib/kiosk-content'

type Props = {
  profile: KioskKeyFigureProfile
  fieldLogHint?: string
}

function KeyFigureCard({
  profile,
  fieldLogHint,
  onOpen,
}: {
  profile: KioskKeyFigureProfile
  fieldLogHint: string
  onOpen: () => void
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
                src={profile.imageUrl}
                alt={profile.imageAlt}
                className={styles.architectPhoto}
              />
            </motion.div>
          </div>
          <div className={styles.personFigureTextCol}>
            <h3 className={styles.architectName}>{profile.name}</h3>
            <p className={styles.architectEpithet}>{profile.epithet}</p>
            <p className={styles.architectRoleLine}>{profile.roleLine}</p>
            {profile.era ? (
              <p className={styles.architectEra}>{profile.era}</p>
            ) : null}
            <button
              type="button"
              className={styles.architectFieldLogCta}
              onClick={onOpen}
              aria-label={`Open field log for ${profile.name}. Extra detail and source.`}>
              Open field log
              <span className={styles.architectFieldLogCtaHint}>
                {fieldLogHint}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function KeyFigureProfileCard({
  profile,
  fieldLogHint = 'More detail and source',
}: Props) {
  const [fieldLogOpen, setFieldLogOpen] = useState(false)
  const closeFieldLog = useCallback(() => setFieldLogOpen(false), [])

  return (
    <>
      <section className={styles.architectsSection} aria-label="Key figure">
        <h2 className={styles.architectsSectionTitle}>Key figure</h2>
        <div
          className={`${styles.architectGrid} ${styles.architectGridSingle}`}>
          <KeyFigureCard
            profile={profile}
            fieldLogHint={fieldLogHint}
            onOpen={() => setFieldLogOpen(true)}
          />
        </div>
      </section>
      <FigureFieldLogModal
        profile={{
          name: profile.name,
          epithet: profile.epithet,
          challenge: profile.fieldLogChallenge,
          fieldLogSource: profile.fieldLogSource,
          fieldLogOmitPrimarySource: profile.fieldLogOmitPrimarySource,
        }}
        open={fieldLogOpen}
        onClose={closeFieldLog}
      />
    </>
  )
}
