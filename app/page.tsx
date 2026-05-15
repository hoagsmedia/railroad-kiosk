import styles from '@/app/kiosk/kiosk.module.css'
import { IronRoadKiosk } from '@/app/components/iron-road/IronRoadKiosk'

export default function Home() {
  return (
    <div className={styles.kioskPageShell}>
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
        <div className={styles.kioskFrameSizer}>
          <div className={styles.kioskFrame}>
            <IronRoadKiosk />
          </div>
        </div>
      </div>
    </div>
  )
}
