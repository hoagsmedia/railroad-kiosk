'use client'

import styles from '@/app/kiosk/kiosk.module.css'
import type { Perspectives } from '@/lib/kiosk-content'

type Props = {
  content: Perspectives
}

export function PerspectivesSidebar({ content }: Props) {
  return (
    <aside className={styles.perspectives} aria-label={content.title}>
      <h3 className={styles.perspectivesTitle}>{content.title}</h3>
      <div className={styles.perspectivesBody}>
        {content.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </aside>
  )
}
