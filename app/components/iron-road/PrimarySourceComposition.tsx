'use client'

import type { ReactNode } from 'react'

import styles from '@/app/kiosk/kiosk.module.css'
import type { PrimarySource } from '@/lib/kiosk-content'

type Props = {
  source: PrimarySource
  onEnlarge: () => void
  /** Optional image stack (e.g. Labor motion + paper). Defaults to framed archival scan. */
  imageStack?: ReactNode
  className?: string
  /** Optional second link (e.g. curatorial exhibit) shown beside archive / enlarge. */
  furtherReading?: { url: string; label: string }
}

export function PrimarySourceComposition({
  source,
  onEnlarge,
  imageStack,
  className,
  furtherReading,
}: Props) {
  const defaultStack = (
    <div className={styles.inlineSourceFrameOuter}>
      <div className={styles.inlineSourceFrame}>
        <div className={styles.inlineSourceMat}>
          <div className={styles.inlineSourceImgWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={source.imageUrl}
              alt={source.imageAlt}
              className={styles.inlineSourceImg}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const sectionClass = [
    styles.exhibitSourceWrap,
    styles.inlineSourceSection,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass} aria-label="Primary source evidence">
      <div className={styles.inlineSourceHeader}>
        <span className={styles.primaryLabel}>Primary source</span>
        <h2 className={styles.inlineSourceTitle}>
          {source.shortLabel}{' '}
          <span
            style={{
              fontWeight: 500,
              opacity: 0.85,
              fontSize: '0.92em',
            }}>
            ({source.year})
          </span>
        </h2>
      </div>
      <div className={styles.inlineSourceComposition}>
        <div className={styles.inlineSourceVisualAnchor}>
          {imageStack ?? defaultStack}
          <div className={styles.inlineSourceLayerContent}>
            <p className={styles.inlineSourceOverlayHint}>
              For more detail, enlarge the scan.
            </p>
            <div className={styles.inlineSourceActions}>
              {furtherReading ? (
                <a
                  href={furtherReading.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.inlineArchiveLink}>
                  {furtherReading.label} ↗
                </a>
              ) : null}
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
