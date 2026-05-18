'use client'

import { motion } from 'framer-motion'

import styles from '@/app/kiosk/kiosk.module.css'

const HERO_IMG = `/assets/primary-sources/${encodeURIComponent('iconic_meeting.jpg')}`

type Props = {
  parallax: { x: number; y: number }
  onEnter: () => void
}

export function ExhibitIntro({ parallax, onEnter }: Props) {
  return (
    <div className={styles.introRoot}>
      <div className={styles.introBgWash} aria-hidden />
      <div className={styles.introPhotoLayer} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMG}
          alt=""
          className={styles.introHeroPhoto}
          style={{
            transform: `translate(${parallax.x * 22}px, ${parallax.y * 14}px) scale(1.05)`,
          }}
        />
      </div>
      <div className={styles.introScrim} aria-hidden />
      <div className={styles.introVignette} aria-hidden />

      <div className={styles.introRailDecor} aria-hidden>
        <div className={styles.introRailTrack} />
      </div>

      <header className={styles.introTopBar}>
        <span className={styles.introBadge}>History 130</span>
        <span className={styles.introBadgeMuted}>Digital kiosk exhibit</span>
      </header>

      <div className={styles.introMain}>
        <motion.p
          className={styles.introEyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          Vision · Decision · Labor · Engineering · Utah & the line · Event ·
          Consequences
        </motion.p>

        <motion.h1
          className={styles.introTitle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.08,
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}>
          The Iron Road
        </motion.h1>

        <motion.div
          className={styles.introRuleWrap}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.28, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'center' }}>
          <div className={styles.introRuleLine} />
        </motion.div>

        <motion.p
          className={styles.introSubtitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}>
          Building the Transcontinental Railroad
        </motion.p>
        <motion.p
          className={styles.introYears}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38, duration: 0.5 }}>
          1863 to 1869
        </motion.p>

        <motion.p
          className={styles.introBlurb}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}>
          Move through eight stops from early surveys to the railroad&apos;s
          legacy. Tap primary sources to enlarge them. Continue and Back move
          between screens.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}>
          <button type="button" className={styles.introCta} onClick={onEnter}>
            Enter the exhibit
          </button>
          <p className={styles.introHint}>
            Use Continue / Back to move between screens
          </p>
        </motion.div>
      </div>
    </div>
  )
}
