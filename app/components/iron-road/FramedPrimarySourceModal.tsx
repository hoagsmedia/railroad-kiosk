'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/app/kiosk/kiosk.module.css'
import {
  getPrimarySourceModalViews,
  type PrimarySource,
} from '@/lib/kiosk-content'
import { formatKioskBodySegment } from '@/lib/format-kiosk-body'
import { ensureKioskImageReady, isKioskImageCached } from '@/lib/kiosk-preload'
import { useKioskPortalRoot } from '@/lib/use-kiosk-portal-root'

type Props = {
  open: boolean
  source: PrimarySource | null
  onClose: () => void
}

export function FramedPrimarySourceModal({ open, source, onClose }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const portalRoot = useKioskPortalRoot()
  const views = source ? getPrimarySourceModalViews(source) : []
  const [viewIndex, setViewIndex] = useState(0)
  const [scanReady, setScanReady] = useState(false)
  const hasMultipleViews = views.length > 1
  const activeView = views[viewIndex] ?? views[0]

  const goPrev = useCallback(() => {
    setViewIndex(i => (i - 1 + views.length) % views.length)
  }, [views.length])

  const goNext = useCallback(() => {
    setViewIndex(i => (i + 1) % views.length)
  }, [views.length])

  useEffect(() => {
    setViewIndex(0)
  }, [source?.imageUrl, open])

  useEffect(() => {
    if (!open || !activeView?.imageUrl) {
      setScanReady(false)
      return
    }

    let cancelled = false
    if (!isKioskImageCached(activeView.imageUrl)) {
      setScanReady(false)
    }

    void ensureKioskImageReady(activeView.imageUrl).then(() => {
      if (cancelled) return
      setScanReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [open, activeView?.imageUrl])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (!hasMultipleViews) return
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose, hasMultipleViews, goPrev, goNext])

  if (!portalRoot) return null

  const showPanel = open && source && activeView && scanReady

  return createPortal(
    <AnimatePresence>
      {open && source && activeView ? (
        <motion.div
          className={`${styles.modalBackdrop} ${styles.modalBackdropRaised}`}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onMouseDown={e => {
            if (e.target === e.currentTarget) onClose()
          }}>
          {showPanel ? (
            <motion.div
              ref={panelRef}
              className={styles.modalPanel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close primary source">
                ×
              </button>
              <p className={styles.modalMeta}>Archival scan</p>
              <h2 id={titleId} className={styles.modalTitle}>
                {source.fullTitle}
                {source.year ? (
                  <>
                    {' '}
                    <span style={{ fontWeight: 400, opacity: 0.85 }}>
                      ({source.year})
                    </span>
                  </>
                ) : null}
              </h2>
              <div className={styles.modalScanColumn}>
                <div className={styles.modalScanCarousel}>
                  {hasMultipleViews ? (
                    <div className={styles.modalScanNavRow}>
                      <button
                        type="button"
                        className={styles.modalScanNavBtn}
                        onClick={goPrev}
                        aria-label="Previous image">
                        ←
                      </button>
                      <p className={styles.modalScanViewLabel}>
                        {activeView.label}{' '}
                        <span className={styles.modalScanViewCount}>
                          ({viewIndex + 1} of {views.length})
                        </span>
                      </p>
                      <button
                        type="button"
                        className={styles.modalScanNavBtn}
                        onClick={goNext}
                        aria-label="Next image">
                        →
                      </button>
                    </div>
                  ) : null}
                  <div className={styles.modalMat}>
                    <div
                      className={`${styles.modalScanWrap} ${styles.modalScanWrapReady}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        key={activeView.imageUrl}
                        src={activeView.imageUrl}
                        alt={activeView.imageAlt}
                        className={styles.modalScan}
                        decoding="sync"
                        fetchPriority="high"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalBody}>
                <p style={{ marginTop: 0 }}>
                  {formatKioskBodySegment(source.transcript)}
                </p>
                <a
                  href={source.archiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.archiveLink}>
                  Open at {source.archiveName} ↗
                </a>
              </div>
            </motion.div>
          ) : (
            <div
              className={styles.modalPanel}
              role="dialog"
              aria-modal="true"
              aria-busy="true"
              aria-label="Loading archival scan">
              <div className={styles.modalMat}>
                <div className={styles.modalScanWrap}>
                  <div className={styles.modalScanPlaceholder} />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    portalRoot
  )
}
