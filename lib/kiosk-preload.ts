import {
  ENGINEERING_LEADERS,
  HART_BLOOMER_SOURCE,
  type EngineeringFieldLogSource,
  type EngineeringLeader,
} from '@/lib/engineering-leaders'
import {
  KIOSK_SCREENS,
  THE_RACE_HUNTINGTON_PROFILE,
  UTAH_LABOR_ASHTON_HOMESTEAD,
  UTAH_LABOR_STEREO_DEVILS_GATE,
  UTAH_LABOR_STEREO_ECHO_CAMP,
  UTAH_LABOR_YOUNG_PROFILE,
  type ExhibitGalleryItem,
  type HistoricalFigureSpotlight,
  type KioskKeyFigureProfile,
  type KioskScreen,
  type PrimarySource,
} from '@/lib/kiosk-content'

/** Intro hero — also preloaded before the exhibit opens. */
export const KIOSK_INTRO_HERO_URL = `/assets/primary-sources/${encodeURIComponent('iconic_meeting.jpg')}`

const EXTRA_PROFILE_SOURCES: PrimarySource[] = [
  UTAH_LABOR_STEREO_DEVILS_GATE,
  UTAH_LABOR_STEREO_ECHO_CAMP,
  UTAH_LABOR_ASHTON_HOMESTEAD,
]

/** Decoded images kept for the session so <img> reuse is instant. */
const imageCache = new Map<string, HTMLImageElement>()

const inFlight = new Map<string, Promise<HTMLImageElement>>()

function addUrl(urls: Set<string>, url?: string | null) {
  if (url) urls.add(url)
}

function collectPrimarySource(urls: Set<string>, source?: PrimarySource) {
  if (!source) return
  addUrl(urls, source.imageUrl)
  source.modalViews?.forEach(view => addUrl(urls, view.imageUrl))
}

function collectGallery(urls: Set<string>, items?: ExhibitGalleryItem[]) {
  items?.forEach(item => addUrl(urls, item.imageUrl))
}

function collectHistoricalFigure(
  urls: Set<string>,
  figure?: HistoricalFigureSpotlight
) {
  if (!figure) return
  addUrl(urls, figure.imageUrl)
  collectGallery(urls, figure.detailModal?.gallery)
}

function collectFieldLogSource(
  urls: Set<string>,
  source?: EngineeringFieldLogSource
) {
  if (!source) return
  addUrl(urls, source.imageUrl)
}

function collectKeyFigureProfile(
  urls: Set<string>,
  profile: KioskKeyFigureProfile
) {
  addUrl(urls, profile.imageUrl)
  collectFieldLogSource(urls, profile.fieldLogSource)
}

function collectEngineeringLeader(
  urls: Set<string>,
  leader: EngineeringLeader
) {
  addUrl(urls, leader.imageUrl)
  collectFieldLogSource(urls, leader.fieldLogSource)
}

function collectScreen(urls: Set<string>, screen: KioskScreen) {
  addUrl(urls, screen.backgroundImageUrl)
  collectPrimarySource(urls, screen.primarySource)
  collectPrimarySource(urls, screen.secondarySource)
  collectGallery(urls, screen.gallery)
  collectHistoricalFigure(urls, screen.historicalFigure)
}

/** All exhibit image URLs (deduped). Derived from kiosk content so new screens stay covered. */
export function collectKioskPreloadUrls(): string[] {
  const urls = new Set<string>()
  addUrl(urls, KIOSK_INTRO_HERO_URL)

  for (const screen of KIOSK_SCREENS) {
    collectScreen(urls, screen)
  }

  for (const leader of ENGINEERING_LEADERS) {
    collectEngineeringLeader(urls, leader)
  }

  collectFieldLogSource(urls, HART_BLOOMER_SOURCE)
  collectKeyFigureProfile(urls, UTAH_LABOR_YOUNG_PROFILE)
  collectKeyFigureProfile(urls, THE_RACE_HUNTINGTON_PROFILE)

  for (const source of EXTRA_PROFILE_SOURCES) {
    collectPrimarySource(urls, source)
  }

  return [...urls]
}

async function decodeImage(img: HTMLImageElement): Promise<void> {
  if (!img.complete || img.naturalWidth === 0) return
  if (typeof img.decode === 'function') {
    try {
      await img.decode()
    } catch {
      // decode() can reject for oversized images; loaded bitmap is still usable
    }
  }
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const img = new Image()
    const finish = () => {
      void decodeImage(img).finally(() => resolve(img))
    }
    img.onload = finish
    img.onerror = finish
    img.src = url
    if (img.complete) finish()
  })
}

/** Load + decode one URL; dedupes concurrent requests. */
export async function ensureKioskImageReady(
  url: string
): Promise<HTMLImageElement> {
  const cached = imageCache.get(url)
  if (cached?.complete && cached.naturalWidth > 0) {
    await decodeImage(cached)
    return cached
  }

  const pending = inFlight.get(url)
  if (pending) return pending

  const promise = loadImageElement(url).then(img => {
    imageCache.set(url, img)
    inFlight.delete(url)
    return img
  })
  inFlight.set(url, promise)
  return promise
}

export function getKioskImageDimensions(
  url: string
): { width: number; height: number } | null {
  const img = imageCache.get(url)
  if (!img?.complete || img.naturalWidth === 0) return null
  return { width: img.naturalWidth, height: img.naturalHeight }
}

export function isKioskImageCached(url: string): boolean {
  const img = imageCache.get(url)
  return Boolean(img?.complete && img.naturalWidth > 0)
}

const MIN_LOADING_MS = 600

export type PreloadProgress = {
  loaded: number
  total: number
}

/** Preload and decode all exhibit images; failed URLs do not block entry. */
export async function preloadKioskAssets(
  onProgress?: (progress: PreloadProgress) => void
): Promise<void> {
  const urls = collectKioskPreloadUrls()
  const total = urls.length
  let loaded = 0

  const report = () => {
    onProgress?.({ loaded, total })
  }

  report()

  const preloadStarted = performance.now()

  const BATCH = 6
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async url => {
        await ensureKioskImageReady(url)
        loaded += 1
        report()
      })
    )
  }

  const elapsed = performance.now() - preloadStarted
  if (elapsed < MIN_LOADING_MS) {
    await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed))
  }
}
