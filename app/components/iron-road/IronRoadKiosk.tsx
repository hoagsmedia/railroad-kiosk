'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import { KIOSK_SCREENS, type KioskScreen } from '@/lib/kiosk-content'
import { EngineeringBlueprintSidebar } from './EngineeringBlueprintSidebar'
import { EngineeringLeaderSpotlight } from './EngineeringLeaderSpotlight'
import { EngineeringScreen } from './EngineeringScreen'
import { ExhibitIntro } from './ExhibitIntro'
import { FramedPrimarySourceModal } from './FramedPrimarySourceModal'
import { PerspectivesSidebar } from './PerspectivesSidebar'
import { TravelerProgressBar } from './TravelerProgressBar'

type State = {
  showIntro: boolean
  screenId: number
  modalOpen: boolean
}

type Action =
  | { type: 'DISMISS_INTRO' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESTART' }
  | { type: 'GO_TO_SCREEN'; screenId: number }

const TOTAL = KIOSK_SCREENS.length

/** Per-screen motion: engineering “unrolls” like a map; others slide horizontally. */
const exhibitPageVariants = {
  initial: (slug: string) =>
    slug === 'engineering'
      ? { scaleY: 0.06, opacity: 0, x: 0 }
      : { x: 28, opacity: 0, scaleY: 1 },
  animate: (slug: string) =>
    slug === 'engineering'
      ? { scaleY: 1, opacity: 1, x: 0 }
      : { x: 0, opacity: 1, scaleY: 1 },
  exit: (slug: string) =>
    slug === 'engineering'
      ? { scaleY: 0.9, opacity: 0, x: 0 }
      : { x: -28, opacity: 0, scaleY: 1 },
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DISMISS_INTRO':
      return { ...state, showIntro: false }
    case 'NEXT':
      return {
        ...state,
        screenId: Math.min(TOTAL, state.screenId + 1),
        modalOpen: false,
      }
    case 'PREV':
      return {
        ...state,
        screenId: Math.max(1, state.screenId - 1),
        modalOpen: false,
      }
    case 'OPEN_MODAL':
      return { ...state, modalOpen: true }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false }
    case 'RESTART':
      return {
        showIntro: false,
        screenId: 1,
        modalOpen: false,
      }
    case 'GO_TO_SCREEN': {
      const next = Math.min(TOTAL, Math.max(1, action.screenId))
      return { ...state, screenId: next, modalOpen: false }
    }
    default:
      return state
  }
}

function screenAt(id: number): KioskScreen | undefined {
  return KIOSK_SCREENS.find(s => s.id === id)
}

const PARALLAX_EASE = 0.12

export function IronRoadKiosk() {
  const [state, dispatch] = useReducer(reducer, {
    showIntro: true,
    screenId: 1,
    modalOpen: false,
  })

  const parallaxTargetRef = useRef({ x: 0, y: 0 })
  const [parallaxSmooth, setParallaxSmooth] = useState({ x: 0, y: 0 })

  const screen = state.showIntro ? undefined : screenAt(state.screenId)
  const currentIndex = state.screenId - 1

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    parallaxTargetRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    }
  }, [])

  const onPointerLeave = useCallback(() => {
    parallaxTargetRef.current = { x: 0, y: 0 }
  }, [])

  useEffect(() => {
    let id: number
    const tick = () => {
      setParallaxSmooth(prev => ({
        x: prev.x + (parallaxTargetRef.current.x - prev.x) * PARALLAX_EASE,
        y: prev.y + (parallaxTargetRef.current.y - prev.y) * PARALLAX_EASE,
      }))
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  if (!state.showIntro && !screen) return null

  return (
    <div
      className="relative flex flex-1 flex-col min-h-0 overflow-hidden"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}>
      {state.showIntro ? (
        <ExhibitIntro
          parallax={parallaxSmooth}
          onEnter={() => dispatch({ type: 'DISMISS_INTRO' })}
        />
      ) : (
        <ExhibitShell
          state={state}
          screen={screen!}
          currentIndex={currentIndex}
          dispatch={dispatch}
          parallax={parallaxSmooth}
        />
      )}
    </div>
  )
}

type ExhibitShellProps = {
  state: State
  screen: NonNullable<ReturnType<typeof screenAt>>
  currentIndex: number
  dispatch: React.Dispatch<Action>
  parallax: { x: number; y: number }
}

function ExhibitShell({
  state,
  screen,
  currentIndex,
  dispatch,
  parallax,
}: ExhibitShellProps) {
  const bg = screen.backgroundImageUrl
  const isEngineering = screen.slug === 'engineering'
  const hasPerspectives = Boolean(screen.perspectives)
  const hasRightColumn = hasPerspectives || isEngineering
  const isEvent = screen.slug === 'event'
  const isGeography = screen.slug === 'geography' && hasPerspectives
  const isCause = screen.slug === 'cause'

  const heading = (
    <div className={styles.exhibitHeadingWrap}>
      <h1 className={styles.screenHeading}>{screen.heading}</h1>
    </div>
  )

  const bodyBlock = (
    <div className={styles.exhibitBodyWrap}>
      <div className={styles.screenBody}>
        {screen.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )

  const sourceBlock = (
    <section
      className={`${styles.exhibitSourceWrap} ${styles.inlineSourceSection}`}
      aria-label="Primary source evidence">
      <div className={styles.inlineSourceHeader}>
        <span className={styles.primaryLabel}>Primary source</span>
        <h2 className={styles.inlineSourceTitle}>
          {screen.primarySource.shortLabel}{' '}
          <span
            style={{
              fontWeight: 500,
              opacity: 0.85,
              fontSize: '0.92em',
            }}>
            ({screen.primarySource.year})
          </span>
        </h2>
      </div>
      <div className={styles.inlineSourceFrameOuter}>
        <div className={styles.inlineSourceFrame}>
          <div className={styles.inlineSourceMat}>
            <div className={styles.inlineSourceImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screen.primarySource.imageUrl}
                alt={screen.primarySource.imageAlt}
                className={styles.inlineSourceImg}
              />
            </div>
          </div>
        </div>
      </div>
      <p className={styles.inlineSourceTranscript}>
        {screen.primarySource.transcript}
      </p>
      <div className={styles.inlineSourceActions}>
        <a
          href={screen.primarySource.archiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.inlineArchiveLink}>
          Open at {screen.primarySource.archiveName} ↗
        </a>
        <button
          type="button"
          className={styles.enlargeBtn}
          onClick={() => dispatch({ type: 'OPEN_MODAL' })}>
          Enlarge
        </button>
      </div>
    </section>
  )

  const galleryBlock =
    screen.gallery && screen.gallery.length > 0 ? (
      <section
        className={styles.exhibitGallery}
        aria-label="Related photographs">
        <h2 className={styles.exhibitGalleryTitle}>
          {screen.galleryTitle ?? 'On the line'}
        </h2>
        <ul className={styles.exhibitGalleryGrid}>
          {screen.gallery.map((item, i) => (
            <li key={i} className={styles.exhibitGalleryItem}>
              <figure className={styles.exhibitGalleryFigure}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  className={styles.exhibitGalleryImg}
                  loading="lazy"
                />
                {item.caption ? (
                  <figcaption className={styles.exhibitGalleryCaption}>
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
        {screen.furtherReading ? (
          <p className={styles.exhibitGalleryReadMore}>
            <a
              href={screen.furtherReading.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineArchiveLink}>
              {screen.furtherReading.label} ↗
            </a>
          </p>
        ) : null}
      </section>
    ) : null

  const navBlock = (
    <nav className={styles.navRow} aria-label="Kiosk navigation">
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => dispatch({ type: 'PREV' })}
        disabled={screen.id <= 1}>
        Back
      </button>
      {screen.id < TOTAL ? (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navBtnPrimary}`}
          onClick={() => dispatch({ type: 'NEXT' })}>
          Continue
        </button>
      ) : (
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navBtnPrimary}`}
          onClick={() => dispatch({ type: 'RESTART' })}>
          Start over
        </button>
      )}
    </nav>
  )

  const engineeringSpotlightBlock =
    screen.engineeringSpotlight != null ? (
      <EngineeringLeaderSpotlight
        leaderId={screen.engineeringSpotlight}
        sectionHeading={screen.engineeringSpotlightHeading}
        singleColumn
      />
    ) : null

  const mainColumn = (
    <div className={styles.exhibitMain}>
      {isEvent ? (
        <>
          {heading}
          {sourceBlock}
          {bodyBlock}
          {galleryBlock}
        </>
      ) : (
        <>
          {heading}
          {bodyBlock}
          {engineeringSpotlightBlock}
          {galleryBlock}
          {sourceBlock}
        </>
      )}
    </div>
  )

  const causeMainColumn = (
    <div className={styles.exhibitMain}>
      {heading}
      <div className={styles.exhibitCauseWrap}>
        <div className={styles.exhibitCauseTextColumn}>
          {bodyBlock}
          {engineeringSpotlightBlock}
          {galleryBlock}
        </div>
        <aside
          className={styles.exhibitCauseDocFloat}
          aria-label="Primary source">
          {sourceBlock}
        </aside>
      </div>
    </div>
  )

  return (
    <div
      className={`${styles.kioskRoot} flex flex-1 flex-col min-h-0 overflow-hidden`}
      data-screen={screen.id}>
      <header className="relative z-[2] shrink-0 border-b border-white/10 bg-black/50 px-4 py-2 backdrop-blur-sm">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#a8947c]">
          History 130 · Digital kiosk
        </p>
        <p className="font-playfair text-lg font-semibold leading-tight text-[#fdf6ec] sm:text-xl">
          The Iron Road: Building the Transcontinental (1863–1869)
        </p>
      </header>
      <div className={styles.bgAtmosphere} aria-hidden />
      {bg ? (
        <div className={styles.bgTextureLayer} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg}
            alt=""
            className={styles.bgTextureImg}
            style={{
              transform: `translate(${parallax.x * 18}px, ${parallax.y * 12}px) scale(1.04)`,
            }}
          />
        </div>
      ) : null}
      <div className={styles.bgReadabilityVeil} aria-hidden />

      <div className={`${styles.screenPanel} relative z-[1]`}>
        <div className={styles.screenPanelScroll}>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen.id}
              className={styles.exhibitPage}
              data-layout={screen.slug}
              data-map-unroll={screen.slug === 'engineering' ? 'true' : 'false'}
              custom={screen.slug}
              variants={exhibitPageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}>
              <div
                className={styles.exhibitPageInner}
                data-layout={screen.slug}
                data-with-sidebar={hasRightColumn ? 'true' : 'false'}>
                {isGeography ? (
                  <>
                    <div className={styles.exhibitMain}>
                      {heading}
                      {bodyBlock}
                    </div>
                    {screen.perspectives ? (
                      <div className={styles.exhibitSidebarSlot}>
                        <PerspectivesSidebar content={screen.perspectives} />
                      </div>
                    ) : null}
                    <div className={styles.exhibitGeographyMapBand}>
                      {sourceBlock}
                    </div>
                  </>
                ) : (
                  <>
                    {isCause ? (
                      causeMainColumn
                    ) : isEngineering ? (
                      <EngineeringScreen
                        screen={screen}
                        sourceBlock={sourceBlock}
                      />
                    ) : (
                      mainColumn
                    )}

                    {screen.perspectives ? (
                      <div className={styles.exhibitSidebarSlot}>
                        <PerspectivesSidebar content={screen.perspectives} />
                      </div>
                    ) : null}
                    {isEngineering ? (
                      <div className={styles.exhibitSidebarSlot}>
                        <EngineeringBlueprintSidebar />
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className={styles.navDock}>{navBlock}</div>
      </div>

      <div className="relative z-[2] mt-auto shrink-0">
        <TravelerProgressBar
          screens={KIOSK_SCREENS}
          currentIndex={currentIndex}
          onSelectScreen={index => {
            const target = KIOSK_SCREENS[index]
            if (target) {
              dispatch({ type: 'GO_TO_SCREEN', screenId: target.id })
            }
          }}
        />
      </div>

      <FramedPrimarySourceModal
        open={state.modalOpen}
        source={screen.primarySource}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      />
    </div>
  )
}
