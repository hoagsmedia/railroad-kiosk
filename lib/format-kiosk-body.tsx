import type { ReactNode } from 'react'

/** Renders `**phrase**` as <strong>. */
export function formatKioskBodySegment(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/)
    if (m) return <strong key={i}>{m[1]}</strong>
    return part
  })
}

export function KioskBodyParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>{formatKioskBodySegment(p)}</p>
      ))}
    </>
  )
}
