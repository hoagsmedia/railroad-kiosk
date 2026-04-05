'use client'

import styles from '@/app/kiosk/kiosk.module.css'

export function EngineeringBlueprintSidebar() {
  return (
    <aside
      className={styles.engineeringBlueprint}
      aria-label="Nineteenth-century engineering methods">
      <div className={styles.engineeringBlueprintPaper}>
        <div className={styles.engineeringBlueprintLines} aria-hidden />
        <h2 className={styles.engineeringBlueprintTitle}>Tech specs</h2>
        <p className={styles.engineeringBlueprintSubtitle}>
          Blueprint notes — tools & structures
        </p>

        <section className={styles.engineeringBlueprintBlock}>
          <h3 className={styles.engineeringBlueprintH3}>
            Nitroglycerin &amp; black powder
          </h3>
          <p className={styles.engineeringBlueprintBody}>
            Crews drilled holes by hand, tamped charges, and set off blasts in
            tight Sierra cuts. Nitroglycerin (dangerously volatile) and black
            powder shattered granite inch by inch—Summit Tunnel No. 6 alone
            required roughly <strong>1,659 feet</strong> of heading through
            solid rock at high elevation.
          </p>
        </section>

        <section className={styles.engineeringBlueprintBlock}>
          <h3 className={styles.engineeringBlueprintH3}>
            Trestles &amp; timber
          </h3>
          <p className={styles.engineeringBlueprintBody}>
            Where stone gave way to air, carpenters threw up massive timber
            trestles. The Dale Creek crossing in Wyoming—often cited near{' '}
            <strong>150 ft</strong> above the gorge—was a timber lattice
            masterpiece: falsework, braces, and speed that today reads like
            daredevil engineering.
          </p>
        </section>

        <p className={styles.engineeringBlueprintFoot}>
          Figures rounded from common period accounts; cite your surveyor.
        </p>
      </div>
    </aside>
  )
}
