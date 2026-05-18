'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import type { HistoricalFigureSpotlight } from '@/lib/kiosk-content'

type Props = {
  figure: HistoricalFigureSpotlight
}

/** Static portrait + epithet + role, e.g. Lincoln on The Decision. */
export function PersonFigureSpotlight({ figure }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <section className={styles.architectsSection} aria-label="Key figure">
      <h2 className={styles.architectsSectionTitle}>Key figure</h2>
      <div className={styles.personFigureShell}>
        <motion.article
          className={styles.personFigureArticle}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}>
          <div className={styles.personFigureRow} style={{ cursor: 'default' }}>
            <div className={styles.personFigurePhotoCol}>
              <motion.div
                className={styles.architectPhotoFrame}
                animate={{ scale: hovered ? 1.03 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={figure.imageUrl}
                  alt={figure.imageAlt}
                  className={styles.architectPhoto}
                />
              </motion.div>
            </div>
            <div className={styles.personFigureTextCol}>
              <h3 className={styles.architectName}>{figure.name}</h3>
              <p className={styles.architectEpithet}>{figure.epithet}</p>
              <p className={styles.architectRoleLine}>{figure.roleBadge}</p>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
