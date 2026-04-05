import type { TimelineAnchor } from '@/lib/kiosk-timeline'

/** Public file under `public/assets/primary-sources/` (URL-encoded for safe paths). */
export function assetPrimary(filename: string): string {
  return `/assets/primary-sources/${encodeURIComponent(filename)}`
}

export type PrimarySource = {
  /** Short label shown next to “Primary source” in the UI */
  shortLabel: string
  /** Full citation-style title */
  fullTitle: string
  year: string
  /** Image URL (local `/assets/primary-sources/…` or `/public` root) */
  imageUrl: string
  imageAlt: string
  transcript: string
  archiveUrl: string
  archiveName: string
}

export type Perspectives = {
  title: string
  body: string[]
}

/** Optional contextual photos (e.g. archival stills) with optional captions */
export type ExhibitGalleryItem = {
  imageUrl: string
  imageAlt: string
  caption?: string
}

export type KioskScreen = {
  id: number
  /** Calendar anchor for traveler bar fill and tick copy */
  timelineAnchor: TimelineAnchor
  /**
   * Compact label on the rail (line breaks allowed, rendered with white-space: pre-line).
   */
  timelineTickLabel: string
  slug: string
  heading: string
  /** Main narrative paragraphs */
  body: string[]
  primarySource: PrimarySource
  perspectives?: Perspectives
  /** Extra images with captions (shown on select screens, e.g. Labor) */
  gallery?: ExhibitGalleryItem[]
  /** Optional heading above gallery (default: “On the line”) */
  galleryTitle?: string
  /** Optional outbound article for classroom context */
  furtherReading?: { url: string; label: string }
  /**
   * Soft full-screen texture (blurred, low contrast) for parallax + atmosphere.
   * Chosen per theme; often different from the primary source image.
   */
  backgroundImageUrl?: string
  /**
   * One engineering leader placed on this screen to match its timeline anchor
   * (Judah → charter era, Crocker → Sierra construction / labor, Dodge → UP engineering).
   */
  engineeringSpotlight?: 'judah' | 'crocker' | 'dodge'
  /** Optional `<h2>` for the spotlight section (default: “Leadership spotlight”). */
  engineeringSpotlightHeading?: string
}

export const KIOSK_SCREENS: KioskScreen[] = [
  {
    id: 1,
    timelineAnchor: { year: 1862, month: 7, day: 1 },
    timelineTickLabel: 'Jul\n1862',
    slug: 'cause',
    heading: 'The Cause',
    body: [
      'History 130 — Historical thinking spotlight: Cause and consequence (Concept #3). The transcontinental railroad was not born in a vacuum. In the crucible of the Civil War, the United States faced a strategic question: how to keep distant territories—and especially California—economically and politically tied to the Union.',
      'President Abraham Lincoln signed the Pacific Railway Act in 1862, authorizing land grants and bonds to push a rail line westward. The law was both economic policy and wartime strategy: binding the Pacific coast more tightly to the national core.',
      'What followed was one of the great engineering and labor stories of the nineteenth century—and a cascade of consequences you will trace in the screens ahead, from mountain grades to telegraph wires.',
    ],
    galleryTitle: 'Lincoln and the railroad',
    gallery: [
      {
        imageUrl: assetPrimary('lincoln-seated-loc-2008680391.jpg'),
        imageAlt:
          'Seated portrait of President Abraham Lincoln, facing front, Washington, D.C., January 1864',
      },
    ],
    engineeringSpotlight: 'judah',
    engineeringSpotlightHeading: 'Engineer of the charter era',
    primarySource: {
      shortLabel: 'Pacific Railway Act (1862)',
      fullTitle:
        'An Act to aid in the Construction of a Railroad and Telegraph Line from the Missouri River to the Pacific Ocean',
      year: '1862',
      imageUrl: assetPrimary('Pacific Railway Act.jpg'),
      imageAlt: 'Digitized scan of the Pacific Railway Act (1862)',
      transcript:
        'The 1862 statute chartered the Union Pacific and associated companies, framed federal land grants, and set the basic framework for a continuous railroad and telegraph route to the Pacific—linking national defense, settlement, and commerce in a single legislative act.',
      archiveUrl: 'https://www.loc.gov/item/rbpe.01001500/',
      archiveName: 'Library of Congress',
    },
    backgroundImageUrl: assetPrimary('map_lg.jpg'),
  },
  {
    id: 2,
    timelineAnchor: { year: 1864, month: 1, day: 15 },
    timelineTickLabel: 'Jan\n1864',
    engineeringSpotlight: 'crocker',
    engineeringSpotlightHeading: 'Construction chief on the line',
    slug: 'labor',
    heading: 'The Labor',
    body: [
      'Tunneling and grading through the Sierra demanded huge crews. The Central Pacific increasingly hired Chinese immigrants—often through contractors—for much of the heaviest and riskiest work.',
      'Payrolls like the one below show who was paid, for what work, and on what terms—paper evidence beneath the story of spikes and engines.',
    ],
    gallery: [
      {
        imageUrl: assetPrimary(
          'chinese-immigrants-railroad-gettyimages-514881902.avif'
        ),
        imageAlt:
          'Historical photograph of Chinese railroad workers along the line with hand tools and track materials',
        caption:
          'On the ground: grading, track, and supply work that kept the western line moving. Managers were slow to hire Chinese crews; labor shortages in the mountains soon made them central to the pace of construction.',
      },
      {
        imageUrl: assetPrimary(
          'railroad-chinese-immigrants-gettyimages-Sierra-Nevada.avif'
        ),
        imageAlt:
          'Historical photograph of railroad construction in the Sierra Nevada mountains',
        caption:
          'The Sierra leg meant cuts, fills, and tunneling in harsh weather. Workers faced explosions, slides, and winter cold—conditions that later scholarship and worker actions helped bring out of the margins of the “heroic” rail narrative.',
      },
    ],
    furtherReading: {
      url: 'https://www.history.com/articles/transcontinental-railroad-chinese-immigrants',
      label:
        'HISTORY: How Chinese immigrants built the western railroad (context)',
    },
    perspectives: {
      title: 'Historical perspectives',
      body: [
        'Scholarship on the Central Pacific emphasizes that Chinese workers numbered in the thousands—often cited at roughly 10,000 or more at peak—and performed an estimated majority (commonly cited around 90%) of the railroad’s labor on the western line.',
        'They faced rockslides, explosives accidents, and brutal winters on the summit. Wage ledgers and correspondence also document unequal treatment: different pay scales, segregated camps, and fewer paths to supervisory roles compared with many white workers—dimensions of power that a triumphalist story alone can erase.',
      ],
    },
    primarySource: {
      shortLabel: 'C.P.R.R. payroll no. 26 (January 1864)',
      fullTitle: 'C.P.R.R. pay roll, no. 26, for month of January 1864',
      year: '1864',
      imageUrl: assetPrimary('payroll_1864_1_26_2_labor_screen.jpg'),
      imageAlt:
        'Handwritten Central Pacific payroll from January 1864, company headquarters, with pay entries and Chinese signatures',
      transcript:
        'Stanford’s Chinese Railroad Workers catalog places this roll at company headquarters. It documents a pay differential between Chinese and white workers and carries Chinese signatures. The sheet pair is archived as payroll_1864_1_26_1 (recto) and payroll_1864_1_26_2 (verso), from the Central Pacific Railroad Collection.',
      archiveUrl: 'https://searchworks.stanford.edu/view/cn005wb2925',
      archiveName: 'Stanford SearchWorks',
    },
    backgroundImageUrl: assetPrimary('iconic_meeting.jpg'),
  },
  {
    id: 3,
    /** Bloomer Cut stereograph era; UP chief Dodge active; CP summit push—mid-build overlap, not one person’s date. */
    timelineAnchor: { year: 1866, month: 6, day: 15 },
    timelineTickLabel: 'c.\n1866',
    engineeringSpotlight: 'dodge',
    engineeringSpotlightHeading: 'Chief engineer, Union Pacific',
    slug: 'engineering',
    heading: 'Engineering & leadership',
    body: [
      'By the mid-1860s the Union Pacific was racing west across the Plains under engineers who treated grades, bridges, and water stops like a military campaign. Grenville M. Dodge—appointed UP chief engineer in 1866—coordinated surveys, defended the line against political meddling, and pushed ties and rails toward a meeting with the Central Pacific.',
      'Alfred A. Hart’s Bloomer Cut stereograph below is a Central Pacific view, but it shows the same world Dodge’s orders lived in: drills, powder smoke, and timber falsework—whether in Sierra granite or above a Wyoming gorge.',
    ],
    primarySource: {
      shortLabel: 'Alfred A. Hart, Bloomer Cut stereograph',
      fullTitle: 'View in Bloomer Cut, near Auburn, 63 feet high',
      year: 'c. 1866',
      imageUrl: assetPrimary('hart-bloomer-cut-stereograph.jpg'),
      imageAlt:
        'Stereograph by Alfred A. Hart: deep railroad cut through rock at Bloomer Cut on the Central Pacific line',
      transcript:
        'Hart’s stereo cards sold the Central Pacific as industrial spectacle—Bloomer Cut became shorthand for courage, chemistry, and the sheer depth of human labor in the Sierra. Open Dodge’s Field Log to read how Union Pacific engineering met comparable challenges on the Plains.',
      archiveUrl: 'https://www.loc.gov/pictures/item/2005682864/',
      archiveName: 'Library of Congress Prints & Photographs',
    },
    backgroundImageUrl: assetPrimary('map_xl.jpg'),
  },
  {
    id: 4,
    timelineAnchor: { year: 1868, month: 9, day: 15 },
    timelineTickLabel: 'Sep\n1868',
    slug: 'geography',
    heading: 'The Geography',
    body: [
      'While the Central Pacific clawed east through the Sierra, the Union Pacific pushed west across the Great Plains. Survey maps translated political charters into lines on paper—rights-of-way, water crossings, and the geometry of expansion.',
      'This geography of rails redrawn on maps was also a geography of power: who would profit from land grants, where towns would rise, and whose homelands the lines would cross.',
    ],
    perspectives: {
      title: 'Historical perspectives',
      body: [
        'For Plains nations, the advancing rail network was inseparable from U.S. military pressure, reservation policy, and the industrial slaughter of the bison. Market hunting to supply hides, sport shooting from trains, and the collapse of herd mobility devastated buffalo populations that had sustained Indigenous economies and cosmologies.',
        'Historians therefore pair the “success” of the transcontinental with what Vine Deloria Jr. and many others frame as catastrophic disruption—a consequence as enduring as steel rail.',
      ],
    },
    primarySource: {
      shortLabel: 'Union Pacific survey map (through 1868)',
      fullTitle:
        'Map of the Union Pacific Rail Road and surveys of 1864, 65, 66, 67, 1868 from Missouri River to the Pacific Ocean',
      year: '1868',
      imageUrl: assetPrimary('map_xl.jpg'),
      imageAlt: 'Scanned map of Union Pacific surveys westward',
      transcript:
        'Compiled survey maps like this one plotted the advancing line across the interior, encoding federal ambition to stitch a continent with iron.',
      archiveUrl: 'https://www.loc.gov/item/98688835/',
      archiveName: 'Library of Congress Geography & Map Division',
    },
    backgroundImageUrl: assetPrimary('payroll_records.jpg'),
  },
  {
    id: 5,
    timelineAnchor: { year: 1869, month: 5, day: 10 },
    timelineTickLabel: '10 May\n1869',
    slug: 'event',
    heading: 'The Event',
    body: [
      'On May 10, 1869, locomotives met at Promontory Summit, Utah Territory. Andrew J. Russell’s photograph—often nicknamed the “Champagne” image—captured engineers and officials toasting completion amid a sea of stovepipe hats.',
      'The spike ceremony was staged for the nation; the labor that made it possible stretched back years and thousands of miles.',
    ],
    galleryTitle: 'Another “last spike”',
    gallery: [
      {
        imageUrl: assetPrimary('LastSpike_Craigellachie_BC_Canada.jpg'),
        imageAlt:
          'Historical photograph of the last spike ceremony for the Canadian Pacific Railway at Craigellachie, British Columbia',
        caption:
          'Another “last spike”: at Craigellachie, B.C., on 7 November 1885, officials drove the final spike for the Canadian Pacific—years after the U.S. line met at Promontory, but the same kind of public finale: iron, crowds, and a story told in one hammer blow.',
      },
    ],
    primarySource: {
      shortLabel: 'Andrew J. Russell, “East meets West” view',
      fullTitle: 'East shakes hands with West at laying last rail',
      year: '1869',
      imageUrl: assetPrimary('iconic_meeting.jpg'),
      imageAlt: 'Photograph of the Last Spike ceremony at Promontory Summit',
      transcript:
        'Russell’s image circulated as visual proof that the nation—recently at war with itself—could project unity through infrastructure. Like any photograph, it is composed: who is centered, who is absent, and what story the frame tells.',
      archiveUrl: 'https://www.loc.gov/pictures/item/2005677835/',
      archiveName: 'Library of Congress Prints & Photographs',
    },
    backgroundImageUrl: assetPrimary('gosp-transcontinental_cartoonloc.webp'),
  },
  {
    id: 6,
    timelineAnchor: { year: 1869, month: 5, day: 10 },
    timelineTickLabel: '10 May\n1869',
    slug: 'communication',
    heading: 'The Communication',
    body: [
      'History 130 — Returning to cause and consequence (Concept #3): the railroad’s completion accelerated the economic incorporation of the West—timber, minerals, cattle, and crops moved on rail schedules—and helped close the era historians often describe as the “frontier” of open-ended continental expansion.',
      'Telegraph wires bundled with the right-of-way meant news could outrun steam. When the last spike was driven, a one-word message—“Done”—flashed along the wires, collapsing distance for everyone within reach of a sounder.',
    ],
    primarySource: {
      shortLabel: 'The “Done” telegram (May 10, 1869)',
      fullTitle:
        'Western Union telegraph transmission: “Done.” (Promontory Summit)',
      year: '1869',
      imageUrl: assetPrimary('done-telegram-facsimile.svg'),
      imageAlt:
        'Facsimile Western Union–style telegraph form with the word DONE in large type',
      transcript:
        'Contemporary accounts describe a brief telegraphic bulletin—famously the single word “Done”—signaling completion to officials and news outlets. The National Park Service and other institutions reproduce the wording in interpretive materials; original paper forms vary by archive. The facsimile shown here isolates the attested one-word message for classroom reading while the NPS article below situates the event.',
      archiveUrl:
        'https://www.nps.gov/gosp/learn/historyculture/the-last-spike.htm',
      archiveName:
        'National Park Service (Golden Spike National Historical Park)',
    },
    backgroundImageUrl: assetPrimary('Pacific Railway Act.jpg'),
  },
]

export function screenById(id: number): KioskScreen | undefined {
  return KIOSK_SCREENS.find(s => s.id === id)
}
