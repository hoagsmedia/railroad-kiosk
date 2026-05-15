'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import styles from '@/app/kiosk/kiosk.module.css'
import {
  KIOSK_SCREENS,
  primarySourceForExhibitGalleryItem,
  UTAH_LABOR_STEREO_DEVILS_GATE,
  UTAH_LABOR_STEREO_ECHO_CAMP,
  UTAH_LABOR_YOUNG_PROFILE,
  type ExhibitGalleryItem,
  type KioskScreen,
  type PrimarySource,
} from '@/lib/kiosk-content'
import { ConceptThreadLine } from './ConceptThreadLine'
import { EngineeringBlueprintSidebar } from './EngineeringBlueprintSidebar'
import { EngineeringLeaderSpotlight } from './EngineeringLeaderSpotlight'
import { ExhibitIntro } from './ExhibitIntro'
import { FramedPrimarySourceModal } from './FramedPrimarySourceModal'
import { PersonFigureSpotlight } from './PersonFigureSpotlight'
import { PrimarySourceComposition } from './PrimarySourceComposition'
import { PerspectivesSidebar } from './PerspectivesSidebar'
import { ScreenBody } from './ScreenBody'
import { TravelerProgressBar } from './TravelerProgressBar'
import { UtahStereographPanel } from './UtahStereographPanel'
import { UtahYoungProfileCard } from './UtahYoungProfileCard'

type State = {
  showIntro: boolean
  screenId: number
  modalOpen: boolean
  /** When set, archival modal shows this scan instead of `screen.primarySource`. */
  modalSourceOverride: PrimarySource | null
}

type Action =
  | { type: 'DISMISS_INTRO' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'OPEN_MODAL'; source?: PrimarySource }
  | { type: 'CLOSE_MODAL' }
  | { type: 'RESTART' }
  | { type: 'GO_TO_SCREEN'; screenId: number }

const TOTAL = KIOSK_SCREENS.length

const exhibitPageVariants = {
  initial: { x: 28, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -28, opacity: 0 },
}

const LABOR_MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function laborStaggerShell(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  }
}

function laborStaggerRow(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: 0.02 },
    },
  }
}

function laborMotionItem(reduceMotion: boolean | null) {
  if (reduceMotion) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0, transition: { duration: 0 } },
    }
  }
  return {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.52, ease: LABOR_MOTION_EASE },
    },
  }
}

function laborMotionPassThrough(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.02 },
    },
  }
}

function laborGalleryStripPassThrough(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.02 },
    },
  }
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
        modalSourceOverride: null,
      }
    case 'PREV':
      return {
        ...state,
        screenId: Math.max(1, state.screenId - 1),
        modalOpen: false,
        modalSourceOverride: null,
      }
    case 'OPEN_MODAL':
      return {
        ...state,
        modalOpen: true,
        modalSourceOverride: action.source ?? null,
      }
    case 'CLOSE_MODAL':
      return { ...state, modalOpen: false, modalSourceOverride: null }
    case 'RESTART':
      return {
        showIntro: false,
        screenId: 1,
        modalOpen: false,
        modalSourceOverride: null,
      }
    case 'GO_TO_SCREEN': {
      const next = Math.min(TOTAL, Math.max(1, action.screenId))
      return {
        ...state,
        screenId: next,
        modalOpen: false,
        modalSourceOverride: null,
      }
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
    modalSourceOverride: null,
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
      className="relative flex h-full min-h-0 flex-col overflow-hidden"
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
  const reduceMotion = useReducedMotion()
  const bg = screen.backgroundImageUrl

  const openExhibitGalleryEnlarge = useCallback(
    (item: ExhibitGalleryItem) => {
      dispatch({
        type: 'OPEN_MODAL',
        source: primarySourceForExhibitGalleryItem(item),
      })
    },
    [dispatch]
  )

  const titleBlock = (
    <>
      <div className={styles.exhibitHeadingWrap}>
        <h1 className={styles.screenHeading}>{screen.heading}</h1>
      </div>
      {screen.conceptThread ? (
        <ConceptThreadLine text={screen.conceptThread} />
      ) : null}
    </>
  )

  const bodyBlock = <ScreenBody screen={screen} />

  const laborPaperStack = (
    <motion.div
      className={styles.exhibitLaborPaperStage}
      style={{ transformOrigin: '100% 0%' }}
      initial={
        reduceMotion ? false : { opacity: 0, x: 220, y: -100, rotate: 15 }
      }
      animate={{ opacity: 1, x: 0, y: 0, rotate: -2.25 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              damping: 24,
              stiffness: 88,
              delay: 0.14,
              mass: 0.85,
            }
      }>
      <div className={styles.exhibitLaborPaperOuter}>
        <div className={styles.exhibitLaborPaperMat}>
          <div className={styles.exhibitLaborPaperImgShell}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screen.primarySource.imageUrl}
              alt={screen.primarySource.imageAlt}
              className={styles.exhibitLaborPaperImg}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )

  const sourceBlock = (
    <PrimarySourceComposition
      source={screen.primarySource}
      onEnlarge={() => dispatch({ type: 'OPEN_MODAL' })}
      furtherReading={screen.furtherReading}
    />
  )

  const laborPrimaryComposition = (
    <PrimarySourceComposition
      source={screen.primarySource}
      onEnlarge={() => dispatch({ type: 'OPEN_MODAL' })}
      className={styles.exhibitLaborPrimaryComposition}
      imageStack={laborPaperStack}
      furtherReading={screen.furtherReading}
    />
  )

  const galleryTitleText = screen.galleryTitle ?? 'On the line'

  const galleryBlock =
    screen.gallery && screen.gallery.length > 0 ? (
      <section
        className={styles.exhibitGallery}
        aria-label="Related photographs">
        {screen.slug === 'labor' ? (
          <motion.div
            className={styles.exhibitLaborGalleryPanel}
            variants={laborMotionPassThrough(reduceMotion)}>
            <motion.h2
              className={styles.exhibitGalleryTitle}
              variants={laborMotionItem(reduceMotion)}>
              {galleryTitleText}
            </motion.h2>
            <motion.ul
              className={`${styles.exhibitLaborFilmStrip} ${styles.exhibitGalleryGrid}`}
              variants={laborGalleryStripPassThrough(reduceMotion)}>
              {screen.gallery.map((item, i) => (
                <motion.li
                  key={i}
                  className={styles.exhibitGalleryItem}
                  variants={laborMotionItem(reduceMotion)}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -1, transition: { duration: 0.22 } }
                  }>
                  <figure className={styles.exhibitGalleryFigure}>
                    <button
                      type="button"
                      className={styles.exhibitLaborGalleryMatBtn}
                      onClick={() => openExhibitGalleryEnlarge(item)}
                      aria-label={`Enlarge photograph: ${item.imageAlt}`}>
                      <div className={styles.exhibitLaborGalleryImgMat}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt=""
                          className={styles.exhibitGalleryImg}
                          loading="lazy"
                        />
                      </div>
                    </button>
                    {item.caption ? (
                      <figcaption className={styles.exhibitGalleryCaption}>
                        {item.caption}
                      </figcaption>
                    ) : null}
                    <div className={styles.exhibitLaborGalleryActions}>
                      <button
                        type="button"
                        className={styles.enlargeBtn}
                        onClick={() => openExhibitGalleryEnlarge(item)}>
                        Enlarge
                      </button>
                    </div>
                  </figure>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ) : (
          <div className={styles.exhibitLaborGalleryPanel}>
            <h2 className={styles.exhibitGalleryTitle}>{galleryTitleText}</h2>
            <div className={styles.exhibitLaborFilmStrip}>
              <ul className={styles.exhibitGalleryGrid}>
                {screen.gallery.map((item, i) => (
                  <li key={i} className={styles.exhibitGalleryItem}>
                    <figure className={styles.exhibitGalleryFigure}>
                      <button
                        type="button"
                        className={styles.exhibitLaborGalleryMatBtn}
                        onClick={() => openExhibitGalleryEnlarge(item)}
                        aria-label={`Enlarge photograph: ${item.imageAlt}`}>
                        <div className={styles.exhibitLaborGalleryImgMat}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt=""
                            className={styles.exhibitGalleryImg}
                            loading="lazy"
                          />
                        </div>
                      </button>
                      {item.caption ? (
                        <figcaption className={styles.exhibitGalleryCaption}>
                          {item.caption}
                        </figcaption>
                      ) : null}
                      <div className={styles.exhibitLaborGalleryActions}>
                        <button
                          type="button"
                          className={styles.enlargeBtn}
                          onClick={() => openExhibitGalleryEnlarge(item)}>
                          Enlarge
                        </button>
                      </div>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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
        singleColumn
      />
    ) : null

  const historicalFigureBlock =
    screen.historicalFigure != null ? (
      <PersonFigureSpotlight figure={screen.historicalFigure} />
    ) : null

  const personAnchorBlock = engineeringSpotlightBlock ?? historicalFigureBlock

  const visionDecisionLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <div className={styles.museumSplitPrimary}>
        <div className={styles.museumNarrative}>
          {bodyBlock}
          {personAnchorBlock ? (
            <div className={styles.museumPersonAnchor}>{personAnchorBlock}</div>
          ) : null}
        </div>
        <div className={styles.museumPrimaryCell}>{sourceBlock}</div>
      </div>
    </div>
  )

  const engineeringLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <div className={styles.museumEngineeringStack}>
        <div className={styles.museumEngineeringSplit}>
          <div className={styles.museumNarrative}>
            {bodyBlock}
            {engineeringSpotlightBlock ? (
              <div className={styles.museumPersonAnchor}>
                {engineeringSpotlightBlock}
              </div>
            ) : null}
          </div>
          <div
            className={`${styles.museumPrimaryCell} ${styles.museumEngineeringBand}`}>
            {sourceBlock}
          </div>
        </div>
        <div className={styles.museumBlueprintRow}>
          <EngineeringBlueprintSidebar />
        </div>
      </div>
    </div>
  )

  const utahLaborLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <div className={styles.museumUtahShell}>
        <div className={styles.museumUtahLeft}>
          {bodyBlock}
          <UtahYoungProfileCard profile={UTAH_LABOR_YOUNG_PROFILE} />
          <div className={styles.museumUtahDevilsGateSlot}>
            <UtahStereographPanel
              source={UTAH_LABOR_STEREO_DEVILS_GATE}
              onEnlarge={() =>
                dispatch({
                  type: 'OPEN_MODAL',
                  source: UTAH_LABOR_STEREO_DEVILS_GATE,
                })
              }
            />
          </div>
        </div>
        <div className={styles.museumUtahRight}>
          {screen.perspectives ? (
            <PerspectivesSidebar content={screen.perspectives} />
          ) : null}
          <UtahStereographPanel
            source={UTAH_LABOR_STEREO_ECHO_CAMP}
            onEnlarge={() =>
              dispatch({
                type: 'OPEN_MODAL',
                source: UTAH_LABOR_STEREO_ECHO_CAMP,
              })
            }
          />
        </div>
      </div>
    </div>
  )

  const eventLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <div className={styles.museumHeroStack}>
        <div className={styles.museumHeroTextBand}>{bodyBlock}</div>
        <div className={styles.museumHeroFigure}>{sourceBlock}</div>
      </div>
    </div>
  )

  const consequencesLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <div className={styles.museumHeroStack}>
        <div
          className={`${styles.museumHeroTextBand} ${styles.museumHeroNarrow}`}>
          {bodyBlock}
        </div>
        <div
          className={`${styles.museumHeroFigure} ${styles.museumHeroFigureConsequences}`}>
          {sourceBlock}
        </div>
      </div>
    </div>
  )

  const laborLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={styles.museumLaborShell}
        variants={laborStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.div
          className={styles.museumLaborTop}
          variants={laborStaggerRow(reduceMotion)}>
          <motion.div
            className={styles.museumLaborTopLeft}
            variants={laborStaggerRow(reduceMotion)}>
            <motion.div
              className={styles.museumLaborCopy}
              variants={laborMotionItem(reduceMotion)}>
              {bodyBlock}
            </motion.div>
            {screen.engineeringSpotlight ? (
              <motion.div variants={laborMotionItem(reduceMotion)}>
                <EngineeringLeaderSpotlight
                  leaderId={screen.engineeringSpotlight}
                  presentation="laborHorizontal"
                  reduceMotion={reduceMotion}
                />
              </motion.div>
            ) : null}
          </motion.div>
          <motion.div
            className={styles.museumLaborPrimary}
            variants={laborMotionItem(reduceMotion)}>
            {laborPrimaryComposition}
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.museumLaborBottom}
          variants={laborStaggerRow(reduceMotion)}>
          <motion.div
            className={styles.museumLaborGallery}
            variants={laborMotionItem(reduceMotion)}>
            {galleryBlock}
          </motion.div>
          {screen.perspectives ? (
            <motion.div
              className={styles.museumLaborPerspectives}
              variants={laborMotionItem(reduceMotion)}>
              <PerspectivesSidebar content={screen.perspectives} />
            </motion.div>
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  )

  let exhibitContent: ReactNode
  switch (screen.slug) {
    case 'vision':
    case 'decision':
    case 'the-race':
      exhibitContent = visionDecisionLayout
      break
    case 'labor':
      exhibitContent = laborLayout
      break
    case 'engineering':
      exhibitContent = engineeringLayout
      break
    case 'utah-labor':
      exhibitContent = utahLaborLayout
      break
    case 'event':
      exhibitContent = eventLayout
      break
    case 'consequences':
      exhibitContent = consequencesLayout
      break
    default:
      exhibitContent = visionDecisionLayout
  }

  return (
    <div
      className={`${styles.kioskRoot} flex h-full min-h-0 flex-col overflow-hidden`}
      data-screen={screen.id}>
      <header className="relative z-[2] shrink-0 border-b border-white/10 bg-black/50 px-4 py-2 backdrop-blur-sm">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#a8947c]">
          History 130 · Digital kiosk
        </p>
        <p className="font-playfair text-lg font-semibold leading-tight text-[#fdf6ec] sm:text-xl">
          The Iron Road: 1861–1869
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
              data-map-unroll="false"
              variants={exhibitPageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}>
              <div
                className={styles.exhibitPageInner}
                data-layout={screen.slug}>
                {exhibitContent}
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
        source={
          state.modalOpen
            ? (state.modalSourceOverride ?? screen.primarySource)
            : null
        }
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      />
    </div>
  )
}
