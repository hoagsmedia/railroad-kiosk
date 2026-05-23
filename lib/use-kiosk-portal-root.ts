'use client'

import { useEffect, useState } from 'react'

export const KIOSK_PORTAL_ROOT_ID = 'kiosk-portal-root'

/** Portal target inside the kiosk shell so modals work in fullscreen mode. */
export function useKioskPortalRoot(): HTMLElement | null {
  const [root, setRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRoot(document.getElementById(KIOSK_PORTAL_ROOT_ID) ?? document.body)
  }, [])

  return root
}
