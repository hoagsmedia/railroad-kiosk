'use client'

import { collectKioskPreloadUrls } from '@/lib/kiosk-preload'
import styles from '@/app/kiosk/kiosk.module.css'

const WARM_URLS = collectKioskPreloadUrls()

/**
 * Keeps decoded bitmaps attached to the document so visible <img> tags paint immediately.
 * Render once for the exhibit session (hidden, no layout impact).
 */
export function KioskWarmImagePool() {
  return (
    <div className={styles.kioskWarmPool} aria-hidden inert>
      {WARM_URLS.map(url => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={url} src={url} alt="" width={1} height={1} decoding="sync" />
      ))}
    </div>
  )
}
