'use client'

import styles from '@/app/kiosk/kiosk.module.css'
import { formatKioskBodySegment } from '@/lib/format-kiosk-body'

type Props = { text: string }

export function ConceptThreadLine({ text }: Props) {
  return (
    <p className={styles.conceptThread} role="note">
      {formatKioskBodySegment(text)}
    </p>
  )
}
