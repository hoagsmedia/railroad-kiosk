'use client'

import styles from '@/app/kiosk/kiosk.module.css'
import type { UtahLaborFigureProfile } from '@/lib/kiosk-content'

type Props = {
  profile: UtahLaborFigureProfile
}

/**
 * Labor-style horizontal figure strip (photo left, meta right), read-only.
 */
export function UtahYoungProfileCard({ profile }: Props) {
  return (
    <section
      className={styles.museumLaborFigureCard}
      aria-label={`Profile: ${profile.name}`}>
      <div className={styles.museumUtahYoungCardInner}>
        <div className={styles.museumLaborFigureCardPhoto}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.imageUrl}
            alt={profile.imageAlt}
            className={styles.museumLaborFigureCardImg}
          />
        </div>
        <div className={styles.museumLaborFigureCardMeta}>
          <h3 className={styles.museumLaborFigureCardName}>{profile.name}</h3>
          <p className={styles.museumLaborFigureCardTitle}>
            {profile.epithet} · {profile.roleLine}
          </p>
          <p className={styles.museumLaborFigureCardYears}>{profile.era}</p>
          <p className={styles.museumUtahYoungLeadership}>
            {profile.leadershipLine}
          </p>
        </div>
      </div>
    </section>
  )
}
