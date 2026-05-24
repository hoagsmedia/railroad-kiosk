'use client'

import styles from '@/app/kiosk/kiosk.module.css'
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
        <h3 className={styles.museumUtahStereoTitle}>
          {source.shortLabel}{' '}
          <span className={styles.museumUtahStereoYear}>({source.year})</span>
        </h3>
      </div>
      <div className={styles.inlineSourceComposition}>
        <div className={styles.inlineSourceVisualAnchor}>
          <div className={styles.inlineSourceFrameOuter}>
            <div className={styles.inlineSourceFrame}>
              <div className={styles.inlineSourceMat}>
                <div className={styles.inlineSourceImgWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={source.imageUrl}
                    alt={source.imageAlt}
                    className={styles.inlineSourceImg}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.inlineSourceLayerContent}>
            <div className={styles.inlineSourceActions}>
              <a
                href={source.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineArchiveLink}>
                Open at {source.archiveName} ↗
              </a>
              <button
                type="button"
                className={styles.enlargeBtn}
                onClick={onEnlarge}>
                Enlarge
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
