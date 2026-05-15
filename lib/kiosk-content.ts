import type { TimelineAnchor } from '@/lib/kiosk-timeline'

/** Public file under `public/assets/primary-sources/` (URL-encoded for safe paths). */
export function assetPrimary(filename: string): string {
  return `/assets/primary-sources/${encodeURIComponent(filename)}`
}

export type PrimarySource = {
  shortLabel: string
  fullTitle: string
  year: string
  imageUrl: string
  imageAlt: string
  transcript: string
  /** Shorter on-screen caption; modal uses full `transcript`. */
  kioskTranscript?: string
  archiveUrl: string
  archiveName: string
}

export type Perspectives = {
  title: string
  body: string[]
}

export type ExhibitGalleryItem = {
  imageUrl: string
  imageAlt: string
  caption?: string
  /** Shown in enlarge modal title; falls back to `imageAlt`. */
  modalTitle?: string
  modalYear?: string
  /** Modal body; falls back to `caption` or `imageAlt`. */
  modalTranscript?: string
  archiveUrl?: string
  archiveName?: string
}

/** Build modal payload for “On the line” and similar exhibit galleries. */
export function primarySourceForExhibitGalleryItem(
  item: ExhibitGalleryItem
): PrimarySource {
  const caption = item.caption ?? ''
  const transcript = item.modalTranscript ?? (caption || item.imageAlt)
  return {
    shortLabel: item.modalTitle ?? item.imageAlt.slice(0, 72),
    fullTitle: item.modalTitle ?? item.imageAlt,
    year: item.modalYear ?? 'c. 1860s',
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    transcript,
    kioskTranscript: caption || undefined,
    archiveUrl:
      item.archiveUrl ??
      'https://www.loc.gov/pictures/search/?q=transcontinental+railroad+Chinese',
    archiveName: item.archiveName ?? 'Library of Congress (search)',
  }
}

/** Portrait spotlight without engineering field log (e.g. Lincoln). */
export type HistoricalFigureSpotlight = {
  name: string
  epithet: string
  roleBadge: string
  imageUrl: string
  imageAlt: string
}

export type BodySection = {
  title: string
  paragraphs: string[]
}

export type KioskScreen = {
  id: number
  timelineAnchor: TimelineAnchor
  timelineTickLabel: string
  slug: string
  heading: string
  body: string[]
  bodySections?: BodySection[]
  conceptThread?: string
  primarySource: PrimarySource
  perspectives?: Perspectives
  gallery?: ExhibitGalleryItem[]
  galleryTitle?: string
  furtherReading?: { url: string; label: string }
  backgroundImageUrl?: string
  engineeringSpotlight?: 'judah' | 'crocker' | 'dodge'
  historicalFigure?: HistoricalFigureSpotlight
}

/** Utah screen: Brigham Young strip (Labor-style layout, informational only). */
export type UtahLaborFigureProfile = {
  name: string
  epithet: string
  roleLine: string
  era: string
  leadershipLine: string
  imageUrl: string
  imageAlt: string
}

export const UTAH_LABOR_STEREO_DEVILS_GATE: PrimarySource = {
  shortLabel: 'Devil’s Gate bridge, Weber Canyon',
  fullTitle:
    'Excursion train on permanent bridge at Devil’s Gate, Weber Canyon (stereograph)',
  year: '1869',
  imageUrl: assetPrimary('devils-gate-bridge.jpg'),
  imageAlt:
    'Stereograph: Union Pacific train on a timber trestle at Devil’s Gate, Weber Canyon',
  transcript:
    'Russell sold the **Union Pacific** by leaning into spectacle: **timber trestle** over the water, excursion cars, canyon walls Utah crews were still grading toward **Promontory**.',
  kioskTranscript:
    '**UP** stereograph: trestle and excursion train in **Weber Canyon**.',
  archiveUrl:
    'https://www.loc.gov/pictures/search/?q=Devil%27s+Gate+Weber+Russell',
  archiveName: 'Library of Congress (search)',
}

export const UTAH_LABOR_STEREO_ECHO_CAMP: PrimarySource = {
  shortLabel: 'Mormon workers’ camp, Echo Canyon',
  fullTitle:
    'No. 109, Mormon Village, on line of Railroad, Echo Canyon (stereograph)',
  year: 'c. 1868',
  imageUrl: assetPrimary('mormon-village.jpg'),
  imageAlt:
    'Stereograph: tent encampment of railroad workers at Echo Canyon on the Union Pacific line',
  transcript:
    'Echo Canyon “**Mormon Village**” is basically the contract camp: **wall tents** on the slope, a scratch town where **bishop-led** gangs crashed between **fills** and **UP** **track**.',
  kioskTranscript:
    '**Echo Canyon**: tents and supply lines on the **contract grade**.',
  archiveUrl:
    'https://exhibits.usu.edu/exhibits/show/transcontinentalrailroad/anticipationandanxiety/latterdaysaints',
  archiveName: 'USU Digital Exhibits',
}

export const UTAH_LABOR_YOUNG_PROFILE: UtahLaborFigureProfile = {
  name: 'Brigham Young',
  epithet: 'Territorial planner',
  roleLine:
    'Signed 1868 Union Pacific contract; delegated bishop-led grading crews',
  era: 'c. 1868 · Echo & Weber Canyons',
  leadershipLine:
    'He hammered company people on the telegraph for tools and a Salt Lake tie-in. When shipments fell through he sometimes paid out of pocket while Utah crews and the parallel **Central Pacific** were both bearing down on Promontory.',
  imageUrl: assetPrimary('brigham-young.jpg'),
  imageAlt: 'Portrait of Brigham Young',
}

/**
 * Chronological narrative: Vision → Decision → Labor → Engineering → Utah labor → Race → Event → Consequences.
 */
export const KIOSK_SCREENS: KioskScreen[] = [
  {
    id: 1,
    timelineAnchor: { year: 1861, month: 3, day: 1 },
    timelineTickLabel: 'c.\n1861',
    slug: 'vision',
    heading: 'The Vision',
    conceptThread:
      "**Vision** first honestly. If you can't show a workable line through the mountains there's nothing real to charter yet.",
    engineeringSpotlight: 'judah',
    body: [
      'Late 1850s **Theodore Judah** is out doing **surveys**, bugging investors, saying granite and snow are engineering headaches not a reason to bail.',
      'His **maps** and **court testimony** finally gave backers something they could point at: a Sierra crossing that could happen if someone paid for it.',
    ],
    primarySource: {
      shortLabel: 'Survey theodolite (period instrument)',
      fullTitle: 'Theodolite used for measuring angles and grades in the field',
      year: '19th c.',
      imageUrl: assetPrimary('theodolite_pic2_size1.webp'),
      imageAlt:
        'Vintage theodolite surveying instrument on a tripod, used for measuring angles and grades',
      transcript:
        'Teams carried theodolites to nail angles and grades way before steel caught up. Same kind of stubborn field math Judah used when he swore the Sierra was crossable.',
      archiveUrl: 'https://www.loc.gov/pictures/search/?q=theodolite',
      archiveName: 'Library of Congress (search)',
    },
    backgroundImageUrl: assetPrimary('map_lg.jpg'),
  },
  {
    id: 2,
    timelineAnchor: { year: 1862, month: 7, day: 1 },
    timelineTickLabel: 'Jul\n1862',
    slug: 'decision',
    heading: 'The Decision',
    conceptThread:
      '**Law** is what actually moves the money. 1862 turned arguing into land grants bonds and two companies that had a job.',
    historicalFigure: {
      name: 'Abraham Lincoln',
      epithet: 'The President',
      roleBadge: 'Signed the Pacific Railway Act (1862)',
      imageUrl: assetPrimary('lincoln-seated-loc-2008680391.jpg'),
      imageAlt:
        'Seated portrait of President Abraham Lincoln, facing front, Washington, D.C., January 1864',
    },
    body: [
      'July 1862 **Abraham Lincoln** signs the **Pacific Railway Act** with the **Civil War** on. **Land grants and bonds** were trying to glue California and the West to the Union. Railroad stuff as war strategy basically.',
      'It charters **Union Pacific** and boosts **Central Pacific** toward one line from the Missouri River to the Pacific.',
    ],
    primarySource: {
      shortLabel: 'Pacific Railway Act (1862)',
      fullTitle:
        'An Act to aid in the Construction of a Railroad and Telegraph Line from the Missouri River to the Pacific Ocean',
      year: '1862',
      imageUrl: assetPrimary('Pacific Railway Act.jpg'),
      imageAlt: 'Digitized scan of the Pacific Railway Act (1862)',
      transcript:
        'Single big law packing federal land bond help company charters for railroad plus telegraph out to the ocean. Defense settlement freight all in one file.',
      archiveUrl: 'https://www.loc.gov/item/rbpe.01001500/',
      archiveName: 'Library of Congress',
    },
    backgroundImageUrl: assetPrimary('map_lg.jpg'),
  },
  {
    id: 3,
    timelineAnchor: { year: 1864, month: 1, day: 15 },
    timelineTickLabel: 'Jan\n1864',
    slug: 'labor',
    heading: 'The Labor',
    conceptThread:
      "**Labor** is where paper hits dirt. Gangs brokers pay stubs that don't treat people the same.",
    engineeringSpotlight: 'crocker',
    body: [
      '**Charles Crocker** ran **Central Pacific** construction day to day. Camps contractors the brutal rhythm of Sierra cuts and tunnels. When white hiring dried up he leaned hard on Chinese workers coming in through brokers.',
      "Payroll is boring but it's the receipts. Who clocked in who got paid and on what rude terms.",
    ],
    gallery: [
      {
        imageUrl: assetPrimary(
          'chinese-immigrants-railroad-gettyimages-514881902.avif'
        ),
        imageAlt:
          'Historical photograph of Chinese railroad workers along the line with hand tools and track materials',
        caption:
          'Sierra grade: tools ties crews that carried a huge share of the actual lifting.',
        modalTitle: 'Chinese railroad workers with tools and track materials',
        modalYear: 'c. 1865 to 1869',
        modalTranscript:
          '**Chinese crews** did a ton of the brutal **Sierra** work. **Grading** **track** **supply** often through brokers while **Central Pacific** shoved east from California.',
      },
      {
        imageUrl: assetPrimary(
          'railroad-chinese-immigrants-gettyimages-Sierra-Nevada.avif'
        ),
        imageAlt:
          'Historical photograph of railroad construction in the Sierra Nevada mountains',
        caption: 'Powder cold bad rock while the hero photos looked shiny.',
        modalTitle: 'Sierra Nevada railroad construction',
        modalYear: 'c. 1865 to 1869',
        modalTranscript:
          '**Cuts** **fills** tunnel headings **Sierra** weather **black powder** slides frost. All sitting next to the cleaned up heroic calendar art people saw in print.',
      },
      {
        imageUrl: assetPrimary('chinese-workers.jpg'),
        imageAlt:
          'Historical photograph of Chinese railroad workers with tools along the track',
        caption: 'On the grade: contractor pace not poster art.',
        modalTitle: 'Chinese workers on the grade (primary-source print)',
        modalYear: 'c. 1860s',
        modalTranscript:
          'Print off the **grade**. **Chinese** gangs **tools** **ties**. Tempo came from **contractors** and **Charles Crocker** hiring on the **Central Pacific**.',
      },
    ],
    galleryTitle: 'On the line',
    perspectives: {
      title: 'For context',
      body: [
        'People throw around **10k+** Chinese workers at peak and a big chunk of **CP** labor on the western half. Books stay pretty Golden Spike until you open ledgers and see **unequal pay** and **split camps**.',
      ],
    },
    primarySource: {
      shortLabel: 'C.P.R.R. payroll no. 26',
      fullTitle: 'C.P.R.R. pay roll, no. 26, for month of January 1864',
      year: '1864',
      imageUrl: assetPrimary('payroll_1864_1_26_2_labor_screen.jpg'),
      imageAlt:
        'Handwritten Central Pacific payroll from January 1864, company headquarters, with pay entries and Chinese signatures',
      transcript:
        'January 1864 **Central Pacific** sheet from HQ desk work in **Sacramento** or **San Francisco** not a snowy cut count. **Chinese marks** sit with Euro names in the same columns historians mine for wage gaps and **who built the west end**. Archive has front and back scans.',
      kioskTranscript:
        'Office tally for one January: **names** **days** **Chinese marks** next to English. Archive has the full sheet.',
      archiveUrl: 'https://searchworks.stanford.edu/view/cn005wb2925',
      archiveName: 'Stanford SearchWorks',
    },
    backgroundImageUrl: assetPrimary('iconic_meeting.jpg'),
  },
  {
    id: 4,
    timelineAnchor: { year: 1866, month: 6, day: 15 },
    timelineTickLabel: 'c.\n1866',
    slug: 'engineering',
    heading: 'The Engineering',
    conceptThread:
      '**Engineering** fills in what the law leaves vague. Grade bridges holes in the rock where the map was polite.',
    engineeringSpotlight: 'dodge',
    body: [
      'From **1866** **Grenville M. Dodge** runs **Union Pacific** engineering like a field op. Surveys bridges water stops plus fighting politicians who want the line bent for votes.',
      'On the **Sierra** side **Central Pacific** leaned on **nitroglycerin** **black powder** fat **timber trestles**. Same toolbox sketched in the tech panel.',
      'Survey books and plates turn statute talk into lines on paper. Rivers **land-grant** width station ticks. Flat on vellum mean on the ground when you ask **whose fields** the cut eats.',
    ],
    primarySource: {
      shortLabel: 'Alfred A. Hart, Bloomer Cut stereograph',
      fullTitle: 'View in Bloomer Cut, near Auburn, 63 feet high',
      year: 'c. 1866',
      imageUrl: assetPrimary('hart-bloomer-cut-stereograph.jpg'),
      imageAlt:
        'Stereograph by Alfred A. Hart: deep railroad cut through rock at Bloomer Cut on the Central Pacific line',
      transcript:
        'Hart stereo cards marketed **Central Pacific** like a movie set. **Bloomer Cut** equals powder drills people deep in granite. Dodge **Field Log** is the **UP** half of the toolbox if you want the pair.',
      archiveUrl: 'https://www.loc.gov/pictures/item/2005682864/',
      archiveName: 'Library of Congress Prints & Photographs',
    },
    backgroundImageUrl: assetPrimary('map_xl.jpg'),
  },
  {
    id: 5,
    timelineAnchor: { year: 1868, month: 6, day: 1 },
    timelineTickLabel: 'Jun\n1868',
    slug: 'utah-labor',
    heading: 'Utah & the line',
    conceptThread:
      '**Contract labor** stuck on a skinny corridor. Utah org outside cash race to the spike.',
    body: [
      '**1868** **Brigham Young** **Union Pacific** deal throws Utahns on **Echo** and **Weber** grades when drought ate farm work. **Bishops** run sections basically same machine that moved canal dirt now moves **track**.',
      "**UP** keeps whiffing on promised **tools**. **Young** telegraphs office guys and covers gaps with his own checkbook when he's cornered. **Central Pacific** gangs close by so a lot of Saints cash wages on **either** rail toward **Promontory**.",
    ],
    perspectives: {
      title: 'For context',
      body: [
        'Utah State digital exhibit wires the **1868** contract to canyon work and the join-up race using contracts telegrams boring company mail.',
      ],
    },
    primarySource: {
      ...UTAH_LABOR_STEREO_ECHO_CAMP,
      shortLabel: 'Utah corridor: stereographs & contract context',
      fullTitle:
        'Weber Canyon trestle; Echo Canyon camp; Brigham Young and the 1868 Union Pacific agreement',
      year: 'c. 1868 to 1869',
      transcript:
        'Hit **Enlarge** on each stereo for the long captions. **Young** **1868** deal puts Utahns on **Echo** **Weber** grades. Camp shots and Weber trestle are where **bishop-led** labor meets **UP** steel.',
      kioskTranscript:
        '**Profile** tells **Young** contracting. **Enlarge** each stereograph for **Weber** and **Echo**.',
      archiveUrl:
        'https://exhibits.usu.edu/exhibits/show/transcontinentalrailroad/anticipationandanxiety/latterdaysaints',
      archiveName: 'USU Digital Exhibits',
    },
    furtherReading: {
      url: 'https://www.loc.gov/item/98688835/',
      label: 'Library of Congress, Union Pacific survey map (through 1868)',
    },
    backgroundImageUrl: assetPrimary('payroll_records.jpg'),
  },
  {
    id: 6,
    timelineAnchor: { year: 1869, month: 4, day: 28 },
    timelineTickLabel: 'Apr\n1869',
    slug: 'the-race',
    heading: 'The Race',
    conceptThread:
      'Federal **subsidies** pay by the mile so yeah speed turns into strategy once the charters are locked.',
    body: [
      '**Land** and **bonds** reward track in the ground not waiting around. Both roads go ham. **Hell on Wheels** chasing **UP** **Sierra** cuts on **CP** while bosses fight over the meet point.',
      '**April 1869** they pick **Promontory Summit**. Few days before **Charles Crocker** crews rip **ten miles of rail in a day**. Irish and Chinese teams choreographed burst. Partly theater still real logistics.',
    ],
    primarySource: {
      shortLabel: 'Chinese workers and the iron road (1869)',
      fullTitle:
        'Photograph of Chinese railroad workers with handcar on the line',
      year: '1869',
      imageUrl: assetPrimary('chinese-and-the-iron-road-1869.jpg'),
      imageAlt:
        'Historical photograph of Chinese railroad workers with a handcar on the track',
      transcript:
        'Stuff like this ran in papers and tourist albums endgame. **Handcars** **rails** bodies still moving while **Promontory** and the **ten-mile** stunt steal headlines.',
      kioskTranscript: '**Handcar** crews late push toward Promontory.',
      archiveUrl:
        'https://www.loc.gov/pictures/search/?q=Chinese+railroad+workers+transcontinental',
      archiveName: 'Library of Congress (search)',
    },
    backgroundImageUrl: assetPrimary('map_xl.jpg'),
  },
  {
    id: 7,
    timelineAnchor: { year: 1869, month: 5, day: 10 },
    timelineTickLabel: '10 May\n1869',
    slug: 'event',
    heading: 'The Event',
    conceptThread:
      "**Promontory** is a photo and a party. It doesn't balance the ledger on pain or money.",
    body: [],
    bodySections: [
      {
        title: 'What happened',
        paragraphs: [
          '**May 10 1869** engines square up at **Promontory Summit** Utah Territory. Last spike for cameras basically. Andrew J. Russell frames engineers and stovepipe hats because the country wanted reunion candy.',
        ],
      },
      {
        title: 'Why it mattered',
        paragraphs: [
          "Image sells **national healing through steel** but it's staged. **Golden Spike** jams **powder** **payroll** **politics** into one hammer swing people can clap at.",
        ],
      },
    ],
    primarySource: {
      shortLabel: 'Andrew J. Russell, “East meets West” view',
      fullTitle: 'East shakes hands with West at laying last rail',
      year: '1869',
      imageUrl: assetPrimary('iconic_meeting.jpg'),
      imageAlt: 'Photograph of the Last Spike ceremony at Promontory Summit',
      transcript:
        "Russell pushes **unity through infrastructure** in one frame. Look who's dead center who's missing what the crop is trying to sell you.",
      archiveUrl: 'https://www.loc.gov/pictures/item/2005677835/',
      archiveName: 'Library of Congress Prints & Photographs',
    },
    backgroundImageUrl: assetPrimary('gosp-transcontinental_cartoonloc.webp'),
  },
  {
    id: 8,
    timelineAnchor: { year: 1869, month: 5, day: 10 },
    timelineTickLabel: 'Legacy\n1869',
    slug: 'consequences',
    heading: 'The Consequences',
    conceptThread:
      "**Aftermath** keeps going after the crowd goes home. Markets and land and memory don't stop just because the spike landed.",
    body: [
      'Done track accelerates western **timber** **ore** **cattle** **grain** on schedules and squeezes the country tighter. Upside mostly stuck to **bondholders** railroads **shippers**.',
      'Telegraph outruns steam. People shorthand distance with **Done**. Same corridor scrambles **land** **labor** **law**. Fights over **who owed who** outlive any speech.',
      '**Plains** side the line rides with **Army posts** **reservations** pressure on **bison** herds that fed whole economies. I try to keep the iron road next to **broken treaties** and **mess** not a tidy progress reel.',
    ],
    primarySource: {
      shortLabel: 'The “Done” telegram (May 10, 1869)',
      fullTitle:
        'Western Union telegraph transmission: “Done.” (Promontory Summit)',
      year: '1869',
      imageUrl: assetPrimary('done-telegram-facsimile.svg'),
      imageAlt:
        'Facsimile Western Union style telegraph form with the word DONE in large type',
      transcript:
        'Stories talk about a short wire people remember as **Done**. Facsimile is just the word. Park Service page has the ceremony breakdown.',
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
