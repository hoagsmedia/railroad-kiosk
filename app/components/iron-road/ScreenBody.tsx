'use client'

import styles from '@/app/kiosk/kiosk.module.css'
import { KioskBodyParagraphs } from '@/lib/format-kiosk-body'
import type { KioskScreen } from '@/lib/kiosk-content'

export function ScreenBody({ screen }: { screen: KioskScreen }) {
  if (screen.bodySections?.length) {
    return (
      <div className={styles.exhibitBodyWrap}>
        {screen.bodySections.map((sec, i) => (
          <section key={i} className={styles.bodySection}>
            <h3 className={styles.bodySectionTitle}>{sec.title}</h3>
            <div className={styles.screenBody}>
              <KioskBodyParagraphs paragraphs={sec.paragraphs} />
            </div>
          </section>
        ))}
      </div>
    )
  }
  return (
    <div className={styles.exhibitBodyWrap}>
      <div className={styles.screenBody}>
        <KioskBodyParagraphs paragraphs={screen.body} />
      </div>
    </div>
  )
}
