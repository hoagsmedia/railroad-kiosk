'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import styles from '@/app/kiosk/kiosk.module.css'
import { IronRoadKiosk } from '@/app/components/iron-road/IronRoadKiosk'

function isFullscreenElement(el: Element | null): boolean {
  if (!el) return false
  return (
    document.fullscreenElement === el ||
    // @ts-expect-error legacy Safari
    document.webkitFullscreenElement === el
  )
}

async function requestShellFullscreen(el: HTMLElement): Promise<void> {
  if (el.requestFullscreen) {
    await el.requestFullscreen()
    return
  }
  // @ts-expect-error legacy Safari
  if (el.webkitRequestFullscreen) {
    // @ts-expect-error legacy Safari
    await el.webkitRequestFullscreen()
  }
}

async function exitShellFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    await document.exitFullscreen()
    return
  }
  // @ts-expect-error legacy Safari
  if (document.webkitExitFullscreen) {
    // @ts-expect-error legacy Safari
    await document.webkitExitFullscreen()
  }
}

export function KioskShell() {
  const shellRef = useRef<HTMLDivElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const el = shellRef.current
    setSupported(
      Boolean(
        el &&
        (el.requestFullscreen ||
          // @ts-expect-error legacy Safari
          el.webkitRequestFullscreen)
      )
    )
  }, [])

  useEffect(() => {
    const sync = () => {
      setFullscreen(isFullscreenElement(shellRef.current))
    }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current
    if (!el) return

    try {
      if (isFullscreenElement(el)) {
        await exitShellFullscreen()
      } else {
        await requestShellFullscreen(el)
      }
    } catch {
      // User denied or browser blocked (common without prior gesture on some builds).
    }
  }, [])

  return (
    <div
      ref={shellRef}
      className={`${styles.kioskPageShell} ${fullscreen ? styles.kioskPageShellFullscreen : ''}`}
      data-kiosk-page-shell>
      <div className={styles.kioskBackdrop} aria-hidden />
      <div
        className={styles.kioskMobileOverlay}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="kiosk-mobile-overlay-title"
        aria-describedby="kiosk-mobile-overlay-desc">
        <div className={styles.kioskMobileOverlayPanel}>
          <h2
            id="kiosk-mobile-overlay-title"
            className={styles.kioskMobileOverlayTitle}>
            Desktop Experience Recommended
          </h2>
          <p
            id="kiosk-mobile-overlay-desc"
            className={styles.kioskMobileOverlayBody}>
            This interactive exhibit is designed for a larger screen. Please
            view on a laptop or desktop for the full experience.
          </p>
        </div>
      </div>
      <div className={styles.kioskDesktopStage}>
        {supported ? (
          <button
            type="button"
            className={styles.kioskFullscreenBtn}
            onClick={toggleFullscreen}
            aria-pressed={fullscreen}
            aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}>
            {fullscreen ? 'Exit full screen' : 'Full screen'}
          </button>
        ) : null}
        <div className={styles.kioskFrameSizer}>
          <div className={styles.kioskFrame}>
            <IronRoadKiosk />
          </div>
        </div>
      </div>
      <div
        id="kiosk-portal-root"
        className={styles.kioskPortalRoot}
        aria-hidden={false}
      />
    </div>
  )
}
