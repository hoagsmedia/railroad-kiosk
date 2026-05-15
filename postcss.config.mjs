/**
 * Tailwind v4's PostCSS plugin expects entry CSS like `@import "tailwindcss"`.
 * CSS Modules that only `@import` plain partials (e.g. `kiosk.module.css`) must not
 * go through that pipeline or Turbopack throws CssSyntaxError at line 1.
 *
 * @param {{ file?: string } | undefined} [ctx]
 */
export default function postcssConfig(ctx) {
  const file = (ctx?.file ?? '').replace(/\\/g, '/')
  if (file.endsWith('.module.css')) {
    return { plugins: {} }
  }

  return {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  }
}
