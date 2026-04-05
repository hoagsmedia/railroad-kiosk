'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useId, useRef } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import type { PrimarySource } from '@/lib/kiosk-content'

type Props = {
  open: boolean
  source: PrimarySource | null
  onClose: () => void
}

export function FramedPrimarySourceModal({ open, source, onClose }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && source && (
        <motion.div
          className={styles.modalBackdrop}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onMouseDown={e => {
            if (e.target === e.currentTarget) onClose()
          }}>
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
              {source.fullTitle}{' '}
              <span style={{ fontWeight: 400, opacity: 0.85 }}>
                ({source.year})
              </span>
            </h2>
            <div className={styles.modalScanColumn}>
              <div className={styles.modalMat}>
                <div className={styles.modalScanWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- local / archival assets */}
                  <img
                    src={source.imageUrl}
                    alt={source.imageAlt}
                    className={styles.modalScan}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalBody}>
              <p style={{ marginTop: 0 }}>{source.transcript}</p>
              <a
                href={source.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.archiveLink}>
                Open at {source.archiveName} ↗
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
