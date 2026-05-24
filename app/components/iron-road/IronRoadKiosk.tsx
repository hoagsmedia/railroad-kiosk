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
  THE_RACE_HUNTINGTON_PROFILE,
  UTAH_LABOR_ASHTON_HOMESTEAD,
  UTAH_LABOR_STEREO_DEVILS_GATE,
  UTAH_LABOR_YOUNG_PROFILE,
  type ExhibitGalleryItem,
  type KioskScreen,
  type PrimarySource,
} from '@/lib/kiosk-content'
import {
  formatKioskBodySegment,
  KioskBodyParagraphs,
} from '@/lib/format-kiosk-body'
import { ConceptThreadLine } from './ConceptThreadLine'
import { EngineeringBlueprintSidebar } from './EngineeringBlueprintSidebar'
import { EngineeringLeaderSpotlight } from './EngineeringLeaderSpotlight'
import { ExhibitIntro } from './ExhibitIntro'
import { ExhibitLoadingScreen } from './ExhibitLoadingScreen'
import { KioskWarmImagePool } from './KioskWarmImagePool'
import { preloadKioskAssets } from '@/lib/kiosk-preload'
import { FramedPrimarySourceModal } from './FramedPrimarySourceModal'
import { PersonFigureSpotlight } from './PersonFigureSpotlight'
import { PrimarySourceComposition } from './PrimarySourceComposition'
import { PerspectivesSidebar } from './PerspectivesSidebar'
import { ScreenBody } from './ScreenBody'
import { TravelerProgressBar } from './TravelerProgressBar'
import { UtahStereographPanel } from './UtahStereographPanel'
import { KeyFigureProfileCard } from './KeyFigureProfileCard'

type State = {
  showIntro: boolean
  isPreloading: boolean
  loadProgress: number
  screenId: number
  modalOpen: boolean
  /** When set, archival modal shows this scan instead of `screen.primarySource`. */
  modalSourceOverride: PrimarySource | null
}

type Action =
  | { type: 'DISMISS_INTRO' }
  | { type: 'BEGIN_ENTER' }
  | { type: 'SET_LOAD_PROGRESS'; progress: number }
  | { type: 'ENTER_READY' }
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

const EXHIBIT_MOTION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function exhibitStaggerShell(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  }
}

function exhibitMotionItem(reduceMotion: boolean | null) {
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
      transition: { duration: 0.52, ease: EXHIBIT_MOTION_EASE },
    },
  }
}

function exhibitMotionPassThrough(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.02 },
    },
  }
}

function exhibitGalleryStripPassThrough(reduceMotion: boolean | null) {
  if (reduceMotion) return { hidden: {}, visible: {} }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.02 },
    },
  }
}

/** @deprecated Labor screen only — use exhibitStaggerShell elsewhere. */
const laborStaggerShell = exhibitStaggerShell
/** @deprecated Labor screen only — use exhibitMotionItem elsewhere. */
const laborMotionItem = exhibitMotionItem
const laborMotionPassThrough = exhibitMotionPassThrough
const laborGalleryStripPassThrough = exhibitGalleryStripPassThrough

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DISMISS_INTRO':
      return { ...state, showIntro: false, isPreloading: false }
    case 'BEGIN_ENTER':
      return { ...state, isPreloading: true, loadProgress: 0 }
    case 'SET_LOAD_PROGRESS':
      return { ...state, loadProgress: action.progress }
    case 'ENTER_READY':
      return {
        ...state,
        showIntro: false,
        isPreloading: false,
        loadProgress: 1,
      }
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
        isPreloading: false,
        loadProgress: 0,
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

type IronRoadKioskProps = {
  /** Called on “Enter the exhibit” while the click gesture is still active (for fullscreen). */
  onRequestFullscreen?: () => Promise<void>
}

export function IronRoadKiosk({ onRequestFullscreen }: IronRoadKioskProps) {
  const [state, dispatch] = useReducer(reducer, {
    showIntro: true,
    isPreloading: false,
    loadProgress: 0,
    screenId: 1,
    modalOpen: false,
    modalSourceOverride: null,
  })

  const parallaxTargetRef = useRef({ x: 0, y: 0 })
  const enteringRef = useRef(false)
  const [parallaxSmooth, setParallaxSmooth] = useState({ x: 0, y: 0 })

  const screen =
    state.showIntro || state.isPreloading ? undefined : screenAt(state.screenId)
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

  const handleEnterExhibit = useCallback(async () => {
    if (enteringRef.current || state.isPreloading) return
    enteringRef.current = true
    dispatch({ type: 'BEGIN_ENTER' })

    try {
      await onRequestFullscreen?.()
    } catch {
      // Fullscreen denied — continue into the exhibit.
    }

    try {
      await preloadKioskAssets(({ loaded, total }) => {
        dispatch({
          type: 'SET_LOAD_PROGRESS',
          progress: total > 0 ? loaded / total : 0,
        })
      })
    } finally {
      dispatch({ type: 'ENTER_READY' })
      enteringRef.current = false
    }
  }, [onRequestFullscreen, state.isPreloading])

  if (!state.showIntro && !state.isPreloading && !screen) return null

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}>
      {state.isPreloading ? (
        <ExhibitLoadingScreen progress={state.loadProgress} />
      ) : state.showIntro ? (
        <ExhibitIntro parallax={parallaxSmooth} onEnter={handleEnterExhibit} />
      ) : (
        <>
          <KioskWarmImagePool />
          <ExhibitShell
            state={state}
            screen={screen!}
            currentIndex={currentIndex}
            dispatch={dispatch}
            parallax={parallaxSmooth}
          />
        </>
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

  const laborPaperStack = screen.primarySource ? (
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
  ) : null

  const sourceBlock = screen.primarySource ? (
    <PrimarySourceComposition
      source={screen.primarySource}
      onEnlarge={() => dispatch({ type: 'OPEN_MODAL' })}
      furtherReading={screen.furtherReading}
    />
  ) : null

  const consequencesSecondaryBlock = screen.secondarySource ? (
    <PrimarySourceComposition
      source={screen.secondarySource}
      onEnlarge={() =>
        dispatch({
          type: 'OPEN_MODAL',
          source: screen.secondarySource!,
        })
      }
      className={`${styles.inlineSourceSectionCompact} ${styles.museumConsequencesSecondary}`}
    />
  ) : null

  const laborPrimaryComposition = screen.primarySource ? (
    <PrimarySourceComposition
      source={screen.primarySource}
      onEnlarge={() => dispatch({ type: 'OPEN_MODAL' })}
      className={styles.exhibitLaborPrimaryComposition}
      imageStack={laborPaperStack}
      furtherReading={screen.furtherReading}
    />
  ) : null

  const galleryTitleText = screen.galleryTitle ?? 'On the line'

  const prepGalleryBlock =
    screen.gallery && screen.gallery.length > 0 && screen.slug === 'vision' ? (
      <section
        className={`${styles.exhibitGallery} ${styles.museumPrepGallery} ${styles.museumPrepGalleryInNarrative}`}
        aria-label="Related artifacts">
        <h2 className={styles.exhibitGalleryTitle}>{galleryTitleText}</h2>
        <ul className={styles.exhibitGalleryGrid}>
          {screen.gallery.map((item, i) => (
            <li key={i} className={styles.exhibitGalleryItem}>
              <figure className={styles.exhibitGalleryFigure}>
                <div className={styles.inlineSourceComposition}>
                  <div className={styles.inlineSourceVisualAnchor}>
                    <div className={styles.exhibitPrepGalleryMatBtn}>
                      <div className={styles.exhibitPrepGalleryImgMat}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt={item.imageAlt}
                          className={styles.exhibitGalleryImg}
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <div className={styles.inlineSourceLayerContent}>
                      <div className={styles.inlineSourceActions}>
                        {item.archiveUrl && item.archiveName ? (
                          <a
                            href={item.archiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.inlineArchiveLink}>
                            Open at {item.archiveName} ↗
                          </a>
                        ) : null}
                        <button
                          type="button"
                          className={styles.enlargeBtn}
                          onClick={() => openExhibitGalleryEnlarge(item)}>
                          Enlarge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {item.caption ? (
                  <figcaption className={styles.exhibitGalleryCaption}>
                    {formatKioskBodySegment(item.caption)}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </section>
    ) : null

  const galleryBlock =
    screen.gallery && screen.gallery.length > 0 && screen.slug === 'labor' ? (
      <section
        className={styles.exhibitGallery}
        aria-label="Related photographs">
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
                        loading="eager"
                        decoding="async"
                      />
                      <span
                        className={styles.exhibitLaborGalleryHoverOverlay}
                        aria-hidden>
                        <span className={styles.exhibitLaborGalleryHoverLabel}>
                          Click to enlarge
                        </span>
                      </span>
                    </div>
                  </button>
                  {item.caption ? (
                    <figcaption className={styles.exhibitGalleryCaption}>
                      {formatKioskBodySegment(item.caption)}
                    </figcaption>
                  ) : null}
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
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
          START OVER
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
      <PersonFigureSpotlight
        figure={screen.historicalFigure}
        onEnlargeGalleryItem={openExhibitGalleryEnlarge}
      />
    ) : null

  const personAnchorBlock = engineeringSpotlightBlock ?? historicalFigureBlock

  const visionDecisionLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={styles.museumSplitPrimary}
        variants={exhibitStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.div
          className={styles.museumNarrative}
          variants={exhibitMotionItem(reduceMotion)}>
          {bodyBlock}
          {personAnchorBlock ? (
            <div className={styles.museumPersonAnchor}>{personAnchorBlock}</div>
          ) : null}
          {screen.slug === 'vision' ? prepGalleryBlock : null}
        </motion.div>
        <motion.div
          className={
            screen.slug === 'vision' || screen.slug === 'decision'
              ? `${styles.museumPrimaryCell} ${styles.museumVisionPrimaryCell}`
              : styles.museumPrimaryCell
          }
          variants={exhibitMotionItem(reduceMotion)}>
          {screen.slug === 'vision' ? (
            <div className={styles.museumVisionRightStack}>
              <div className={styles.museumVisionSourceCluster}>
                {sourceBlock}
              </div>
              {screen.perspectives ? (
                <div className={styles.museumVisionPerspectivesSlot}>
                  <PerspectivesSidebar content={screen.perspectives} />
                </div>
              ) : null}
            </div>
          ) : screen.slug === 'decision' && screen.perspectives ? (
            <div className={styles.museumVisionRightStack}>
              {sourceBlock}
              <div className={styles.museumVisionPerspectivesSlot}>
                <PerspectivesSidebar content={screen.perspectives} />
              </div>
            </div>
          ) : (
            sourceBlock
          )}
        </motion.div>
      </motion.div>
    </div>
  )

  const engineeringLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={styles.museumEngineeringStack}
        variants={exhibitStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.div
          className={styles.museumEngineeringSplit}
          variants={exhibitMotionItem(reduceMotion)}>
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
        </motion.div>
        <motion.div
          className={styles.museumBlueprintRow}
          variants={exhibitMotionItem(reduceMotion)}>
          <EngineeringBlueprintSidebar />
        </motion.div>
      </motion.div>
    </div>
  )

  const utahLaborLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={styles.museumUtahShell}
        variants={exhibitStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.figure
          className={styles.museumUtahCenterFigure}
          aria-label={UTAH_LABOR_ASHTON_HOMESTEAD.shortLabel}
          variants={exhibitMotionItem(reduceMotion)}>
          <div className={styles.museumUtahStereoHeader}>
            <h3 className={styles.museumUtahStereoTitle}>
              {UTAH_LABOR_ASHTON_HOMESTEAD.shortLabel}
            </h3>
          </div>
          <div className={styles.inlineSourceComposition}>
            <div className={styles.inlineSourceVisualAnchor}>
              <div className={styles.inlineSourceFrameOuter}>
                <div className={styles.inlineSourceFrame}>
                  <div className={styles.inlineSourceMat}>
                    <div className={styles.inlineSourceImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={UTAH_LABOR_ASHTON_HOMESTEAD.imageUrl}
                        alt={UTAH_LABOR_ASHTON_HOMESTEAD.imageAlt}
                        className={styles.inlineSourceImg}
                        loading="eager"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.inlineSourceLayerContent}>
                <div className={styles.inlineSourceActions}>
                  <a
                    href={UTAH_LABOR_ASHTON_HOMESTEAD.archiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.inlineArchiveLink}>
                    Open at {UTAH_LABOR_ASHTON_HOMESTEAD.archiveName} ↗
                  </a>
                  <button
                    type="button"
                    className={styles.enlargeBtn}
                    onClick={() =>
                      dispatch({
                        type: 'OPEN_MODAL',
                        source: UTAH_LABOR_ASHTON_HOMESTEAD,
                      })
                    }>
                    Enlarge
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.figure>
        <motion.div
          className={styles.museumUtahLeft}
          variants={exhibitMotionItem(reduceMotion)}>
          {bodyBlock}
          <KeyFigureProfileCard profile={UTAH_LABOR_YOUNG_PROFILE} />
        </motion.div>
        <motion.div
          className={styles.museumUtahRight}
          variants={exhibitMotionItem(reduceMotion)}>
          {screen.perspectives ? (
            <PerspectivesSidebar content={screen.perspectives} />
          ) : null}
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
        </motion.div>
      </motion.div>
    </div>
  )

  const theRaceLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={`${styles.museumSplitPrimary} ${styles.museumRaceShell}`}
        variants={exhibitStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.div
          className={`${styles.museumNarrative} ${styles.museumRaceLeft}`}
          variants={exhibitMotionItem(reduceMotion)}>
          {bodyBlock}
          <div className={styles.museumPersonAnchor}>
            <KeyFigureProfileCard
              profile={THE_RACE_HUNTINGTON_PROFILE}
              fieldLogHint="Washington lobbying and Promontory"
            />
          </div>
        </motion.div>
        <motion.div
          className={`${styles.museumPrimaryCell} ${styles.museumRacePrimary}`}
          variants={exhibitMotionItem(reduceMotion)}>
          {sourceBlock}
        </motion.div>
      </motion.div>
    </div>
  )

  const eventLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={styles.museumHeroStack}
        variants={exhibitStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.div
          className={styles.museumHeroTextBand}
          variants={exhibitMotionItem(reduceMotion)}>
          {bodyBlock}
        </motion.div>
        <motion.div
          className={styles.museumHeroFigure}
          variants={exhibitMotionItem(reduceMotion)}>
          {sourceBlock}
        </motion.div>
      </motion.div>
    </div>
  )

  const consequencesLegacySection = screen.bodySections?.[0]
  const consequencesPlainsSection = screen.bodySections?.[1]

  const consequencesLayout = (
    <div className={styles.museumCanvas}>
      <div className={styles.museumTitleBand}>{titleBlock}</div>
      <motion.div
        className={styles.museumConsequencesShell}
        variants={exhibitStaggerShell(reduceMotion)}
        initial="hidden"
        animate="visible">
        <motion.div
          className={styles.museumConsequencesCopyGrid}
          variants={exhibitMotionItem(reduceMotion)}>
          <section
            className={styles.museumConsequencesCol}
            aria-label="Complicated legacy">
            {consequencesLegacySection ? (
              <>
                <h2 className={styles.museumConsequencesHeading}>
                  {consequencesLegacySection.title}
                </h2>
                <div className={styles.museumConsequencesBody}>
                  <KioskBodyParagraphs
                    paragraphs={consequencesLegacySection.paragraphs}
                  />
                </div>
              </>
            ) : null}
          </section>
          <section
            className={`${styles.museumConsequencesCol} ${styles.museumConsequencesPlainsCol}`}
            aria-label="Impact on the Plains Nations">
            {consequencesPlainsSection ? (
              <>
                <h2 className={styles.museumConsequencesHeading}>
                  {consequencesPlainsSection.title}
                </h2>
                <div className={styles.museumConsequencesBody}>
                  <KioskBodyParagraphs
                    paragraphs={consequencesPlainsSection.paragraphs}
                  />
                </div>
              </>
            ) : null}
          </section>
        </motion.div>
        {consequencesSecondaryBlock ? (
          <motion.div
            className={`${styles.museumConsequencesHeroFigure} ${styles.museumHeroFigureConsequences}`}
            variants={exhibitMotionItem(reduceMotion)}>
            {consequencesSecondaryBlock}
          </motion.div>
        ) : null}
      </motion.div>
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
          className={styles.museumLaborBentoCopy}
          variants={laborMotionItem(reduceMotion)}>
          {bodyBlock}
        </motion.div>
        {screen.engineeringSpotlight ? (
          <motion.div
            className={styles.museumLaborBentoFigure}
            variants={laborMotionItem(reduceMotion)}>
            <EngineeringLeaderSpotlight
              leaderId={screen.engineeringSpotlight}
              presentation="laborHorizontal"
              reduceMotion={reduceMotion}
            />
          </motion.div>
        ) : null}
        <motion.div
          className={styles.museumLaborPrimary}
          variants={laborMotionItem(reduceMotion)}>
          {laborPrimaryComposition}
        </motion.div>
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
    </div>
  )

  let exhibitContent: ReactNode
  switch (screen.slug) {
    case 'vision':
    case 'decision':
      exhibitContent = visionDecisionLayout
      break
    case 'the-race':
      exhibitContent = theRaceLayout
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
      <header className="relative z-2 shrink-0 border-b border-white/10 bg-black/50 px-4 py-2 backdrop-blur-sm">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#a8947c]">
          HISTORY 109 · Prof. Kelly Morrow
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
            loading="eager"
            decoding="async"
            style={{
              transform: `translate(${parallax.x * 18}px, ${parallax.y * 12}px) scale(1.04)`,
            }}
          />
        </div>
      ) : null}
      <div className={styles.bgReadabilityVeil} aria-hidden />

      <div className={`${styles.screenPanel} relative z-1`}>
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

      <div className="relative z-2 mt-auto shrink-0">
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
            ? (state.modalSourceOverride ?? screen.primarySource ?? null)
            : null
        }
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      />
    </div>
  )
}
