'use client'

import styles from '@/app/kiosk/kiosk.module.css'
import { EngineeringLeaderSpotlight } from './EngineeringLeaderSpotlight'
import type { KioskScreen } from '@/lib/kiosk-content'

type Props = {
  screen: KioskScreen
  sourceBlock: React.ReactNode
}

export function EngineeringScreen({ screen, sourceBlock }: Props) {
  const heading = (
    <div className={styles.exhibitHeadingWrap}>
      <h1 className={styles.screenHeading}>{screen.heading}</h1>
    </div>
  )

  const bodyBlock = (
    <div className={styles.exhibitBodyWrap}>
      <div className={styles.screenBody}>
        {screen.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )

  return (
    <div className={styles.exhibitMain}>
      {heading}
      {bodyBlock}
      {screen.engineeringSpotlight ? (
        <EngineeringLeaderSpotlight
          leaderId={screen.engineeringSpotlight}
          sectionHeading={screen.engineeringSpotlightHeading}
          singleColumn
        />
      ) : null}
      {sourceBlock}
    </div>
  )
}
