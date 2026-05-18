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
          tamped charges, and fired blasts in tight Sierra cuts. Nitroglycerin
          was powerful but unstable; black powder was slower but familiar.
          Summit Tunnel No. 6 needed roughly <strong>1,659 feet</strong> of
          heading through granite at altitude.
        </p>
        <p>
          <strong>Trestles &amp; timber.</strong> Where rock gave way to air,
          carpenters built timber trestles quickly. Dale Creek in Wyoming, often
          listed near <strong>150 ft</strong> above the gorge, shows the speed
          and risk of that work.
        </p>
      </div>
      <p className={styles.perspectivesFootnote}>
        Numbers are rounded from period accounts.
      </p>
    </aside>
  )
}
