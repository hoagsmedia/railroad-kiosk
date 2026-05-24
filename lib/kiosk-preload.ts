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

function preloadOne(url: string): Promise<void> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

const MIN_LOADING_MS = 600

export type PreloadProgress = {
  loaded: number
  total: number
}

/** Preload exhibit images; failed URLs do not block entry. */
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

  await Promise.all(
    urls.map(async url => {
      await preloadOne(url)
      loaded += 1
      report()
    })
  )

  const elapsed = performance.now() - preloadStarted
  if (elapsed < MIN_LOADING_MS) {
    await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed))
  }
}
