'use client'

import { motion } from 'framer-motion'

import styles from '@/app/kiosk/kiosk.module.css'

type Props = {
  progress: number
}

export function ExhibitLoadingScreen({ progress }: Props) {
  const pct = Math.min(100, Math.round(progress * 100))

  return (
    <div
      className={styles.exhibitLoadingRoot}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Loading exhibit assets, ${pct} percent`}>
      <div className={styles.exhibitLoadingScrim} aria-hidden />
      <div className={styles.exhibitLoadingPanel}>
        <p className={styles.exhibitLoadingKicker}>The Iron Road</p>
        <h2 className={styles.exhibitLoadingTitle}>Preparing the exhibit</h2>
        <p className={styles.exhibitLoadingHint}>
          Loading photographs and archival scans…
        </p>
        <div
          className={styles.exhibitLoadingTrack}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}>
          <motion.div
            className={styles.exhibitLoadingBar}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
        <p className={styles.exhibitLoadingPercent}>{pct}%</p>
      </div>
    </div>
  )
}
