'use client'

import styles from '@/app/kiosk/kiosk.module.css'
import { formatKioskBodySegment } from '@/lib/format-kiosk-body'
import type { PrimarySource } from '@/lib/kiosk-content'

type Props = {
  source: PrimarySource
  onEnlarge: () => void
}

export function UtahStereographPanel({ source, onEnlarge }: Props) {
  return (
    <section
      className={styles.museumUtahStereoPanel}
      aria-label={source.shortLabel}>
      <div className={styles.museumUtahStereoHeader}>
        <span className={styles.museumUtahStereoEyebrow}>
          Archival stereograph
        </span>
        <h3 className={styles.museumUtahStereoTitle}>
          {source.shortLabel}{' '}
          <span className={styles.museumUtahStereoYear}>({source.year})</span>
        </h3>
      </div>
      <div className={styles.utahLaborPaperOuter}>
        <div className={styles.utahLaborPaperMat}>
          <div className={styles.utahLaborPaperImgShell}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source.imageUrl}
              alt={source.imageAlt}
              className={styles.museumUtahStereoImg}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <p className={styles.museumUtahStereoCaption}>
        {formatKioskBodySegment(source.kioskTranscript ?? source.transcript)}
      </p>
      <div className={styles.museumUtahStereoActions}>
        <a
          href={source.archiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.inlineArchiveLink}>
          Open at {source.archiveName} ↗
        </a>
        <button type="button" className={styles.enlargeBtn} onClick={onEnlarge}>
          Enlarge
        </button>
      </div>
    </section>
  )
}
