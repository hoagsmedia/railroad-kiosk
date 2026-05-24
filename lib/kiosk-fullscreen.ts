export function isFullscreenElement(el: Element | null): boolean {
  if (!el) return false
  return (
    document.fullscreenElement === el ||
    // @ts-expect-error legacy Safari
    document.webkitFullscreenElement === el
  )
}

export async function requestElementFullscreen(el: HTMLElement): Promise<void> {
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

export async function exitDocumentFullscreen(): Promise<void> {
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

export function shellSupportsFullscreen(el: HTMLElement | null): boolean {
  if (!el) return false
  return Boolean(
    el.requestFullscreen ||
    // @ts-expect-error legacy Safari
    el.webkitRequestFullscreen
  )
}
