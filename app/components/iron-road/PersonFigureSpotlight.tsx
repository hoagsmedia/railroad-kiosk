'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/app/kiosk/kiosk.module.css'
import { formatKioskBodySegment } from '@/lib/format-kiosk-body'
import type {
  ExhibitGalleryItem,
  HistoricalFigureSpotlight,
} from '@/lib/kiosk-content'
import { useKioskPortalRoot } from '@/lib/use-kiosk-portal-root'

type Props = {
  figure: HistoricalFigureSpotlight
  onEnlargeGalleryItem?: (item: ExhibitGalleryItem) => void
}

function HistoricalFigureModal({
  figure,
  open,
  onClose,
  onEnlargeGalleryItem,
}: {
  figure: HistoricalFigureSpotlight
  open: boolean
  onClose: () => void
  onEnlargeGalleryItem?: (item: ExhibitGalleryItem) => void
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const portalRoot = useKioskPortalRoot()
  const detail = figure.detailModal

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

  if (!portalRoot || !detail) return null

  const galleryTitle = detail.galleryTitle ?? 'Related artifacts'

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`${styles.modalBackdrop} ${styles.engineeringFieldLogBackdrop}`}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseDown={e => {
            if (e.target === e.currentTarget) onClose()
          }}>
          <motion.div
            ref={panelRef}
            className={styles.engineeringFieldLogPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 20, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 12, rotateX: 4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close profile">
              ×
            </button>
            <p className={styles.engineeringFieldLogKicker}>Key figure</p>
            <h2 id={titleId} className={styles.engineeringFieldLogTitle}>
              {figure.name}{' '}
              <span className={styles.engineeringFieldLogEpithet}>
                · {figure.epithet}
              </span>
            </h2>
            <section
              className={styles.engineeringFieldLogSection}
              aria-label="Profile">
              {detail.paragraphs.map((paragraph, i) => (
                <p key={i} className={styles.engineeringFieldLogBody}>
                  {formatKioskBodySegment(paragraph)}
                </p>
              ))}
            </section>
            {detail.gallery && detail.gallery.length > 0 ? (
              <section
                className={styles.engineeringFieldLogSection}
                aria-label={galleryTitle}>
                <h3 className={styles.engineeringFieldLogH3}>{galleryTitle}</h3>
                <ul className={styles.historicalFigureModalGallery}>
                  {detail.gallery.map((item, i) => (
                    <li
                      key={i}
                      className={styles.historicalFigureModalGalleryItem}>
                      <figure
                        className={styles.historicalFigureModalGalleryFigure}>
                        <button
                          type="button"
                          className={styles.historicalFigureModalGalleryBtn}
                          onClick={() => onEnlargeGalleryItem?.(item)}
                          aria-label={`Enlarge artifact: ${item.imageAlt}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt=""
                            className={styles.historicalFigureModalGalleryImg}
                          />
                        </button>
                        {item.caption ? (
                          <figcaption
                            className={
                              styles.historicalFigureModalGalleryCaption
                            }>
                            {item.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {detail.archiveUrl && detail.archiveName ? (
              <a
                href={detail.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.inlineArchiveLink}>
                Open at {detail.archiveName} ↗
              </a>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  )
}

/** Portrait + epithet + role; optional detail modal (e.g. Lincoln on The Decision). */
export function PersonFigureSpotlight({ figure, onEnlargeGalleryItem }: Props) {
  const [hovered, setHovered] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const closeModal = useCallback(() => setModalOpen(false), [])
  const hasDetail = figure.detailModal != null

  return (
    <>
      <section className={styles.architectsSection} aria-label="Key figure">
        <h2 className={styles.architectsSectionTitle}>Key figure</h2>
        <div className={styles.personFigureShell}>
          <motion.article
            className={styles.personFigureArticle}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}>
            <div className={styles.personFigureRow}>
              <div className={styles.personFigurePhotoCol}>
                <motion.div
                  className={styles.architectPhotoFrame}
                  animate={{ scale: hovered ? 1.03 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={figure.imageUrl}
                    alt={figure.imageAlt}
                    className={styles.architectPhoto}
                  />
                </motion.div>
              </div>
              <div className={styles.personFigureTextCol}>
                <h3 className={styles.architectName}>{figure.name}</h3>
                <p className={styles.architectEpithet}>{figure.epithet}</p>
                <p className={styles.architectRoleLine}>{figure.roleBadge}</p>
                {hasDetail ? (
                  <button
                    type="button"
                    className={styles.architectFieldLogCta}
                    onClick={() => setModalOpen(true)}
                    aria-label={`Open profile for ${figure.name}. Western context and related artifacts.`}>
                    Open profile
                    <span className={styles.architectFieldLogCtaHint}>
                      Lincoln and the West
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </motion.article>
        </div>
      </section>
      {hasDetail ? (
        <HistoricalFigureModal
          figure={figure}
          open={modalOpen}
          onClose={closeModal}
          onEnlargeGalleryItem={onEnlargeGalleryItem}
        />
      ) : null}
    </>
  )
}
