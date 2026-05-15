'use client'

import styles from '@/app/kiosk/kiosk.module.css'

export function EngineeringBlueprintSidebar() {
  return (
    <aside
      className={styles.perspectives}
      aria-label="Nineteenth-century engineering methods">
      <h3 className={styles.perspectivesTitle}>Tech specs</h3>
      <p className={styles.perspectivesSubtitle}>
        Blueprint notes: tools &amp; structures
      </p>
      <div className={styles.perspectivesBody}>
        <p>
          <strong>Nitroglycerin &amp; black powder.</strong> Crews hand-drilled,
          tamped charges, and fired blasts in tight Sierra cuts. Unstable
          nitroglycerin and slower black powder broke granite in layers. Summit
          Tunnel No. 6 alone needed roughly <strong>1,659 feet</strong> of
          heading through rock at altitude.
        </p>
        <p>
          <strong>Trestles &amp; timber.</strong> Where rock gave way to air,
          carpenters threw up timber trestles fast. Dale Creek in Wyoming, often
          put near <strong>150 ft</strong> above the gorge, was braced timber
          and nerve in equal parts.
        </p>
      </div>
      <p className={styles.perspectivesFootnote}>
        Numbers rounded from common period sources. Check your own references.
      </p>
    </aside>
  )
}
