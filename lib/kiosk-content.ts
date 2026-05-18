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
    'Russell framed the **Union Pacific** as spectacle: a **timber trestle** over the water, excursion cars, and the canyon walls Utah crews were grading toward **Promontory**.',
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
    'Echo Canyon’s “**Mormon Village**” shows contract camp life: **wall tents** on the slope and a temporary town where **bishop-led** crews lived while building **fills** and **UP** **track**.',
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
    'He pressed company officers by telegraph for tools and a Salt Lake connection. When shipments fell short, he sometimes paid from his own funds while Utah crews and the **Central Pacific** pushed toward Promontory.',
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
      'A railroad starts with a line on paper. Judah had to prove the Sierra route could work before anyone would fund it.',
    engineeringSpotlight: 'judah',
    body: [
      'In the late 1850s, **Theodore Judah** surveyed possible routes, spoke with investors, and argued that granite and snow were engineering problems, not reasons to stop.',
      'His **maps** and **court testimony** gave backers something concrete: a Sierra crossing that could be built if someone paid for it.',
    ],
    primarySource: {
      shortLabel: 'Survey theodolite (period instrument)',
      fullTitle: 'Theodolite used for measuring angles and grades in the field',
      year: '19th c.',
      imageUrl: assetPrimary('theodolite_pic2_size1.webp'),
      imageAlt:
        'Vintage theodolite surveying instrument on a tripod, used for measuring angles and grades',
      transcript:
        'Survey teams used theodolites to measure angles and grades before rails reached the mountains. Judah’s case for the Sierra depended on this kind of field work.',
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
      'The 1862 law turned the railroad from an argument into a funded project with two companies and federal support.',
    historicalFigure: {
      name: 'Abraham Lincoln',
      epithet: 'The President',
      roleBadge: 'Signed the Pacific Railway Act (1862)',
      imageUrl: assetPrimary('lincoln-seated-loc-2008680391.jpg'),
      imageAlt:
        'Seated portrait of President Abraham Lincoln, facing front, Washington, D.C., January 1864',
    },
    body: [
      'In July 1862, **Abraham Lincoln** signed the **Pacific Railway Act** while the **Civil War** was underway. **Land grants and bonds** helped tie California and the West more tightly to the Union.',
      'The act chartered **Union Pacific** and strengthened **Central Pacific**, aiming for one line from the Missouri River to the Pacific.',
    ],
    primarySource: {
      shortLabel: 'Pacific Railway Act (1862)',
      fullTitle:
        'An Act to aid in the Construction of a Railroad and Telegraph Line from the Missouri River to the Pacific Ocean',
      year: '1862',
      imageUrl: assetPrimary('Pacific Railway Act.jpg'),
      imageAlt: 'Digitized scan of the Pacific Railway Act (1862)',
      transcript:
        'The act joined land grants, federal bond support, railroad charters, and a telegraph line to the Pacific. Defense, settlement, and freight all sat in the same law.',
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
      'The railroad was built by hired crews, labor brokers, and pay systems that did not treat workers equally.',
    engineeringSpotlight: 'crocker',
    body: [
      '**Charles Crocker** managed **Central Pacific** construction: camps, contractors, and the hard pace of Sierra cuts and tunnels. When white hiring fell short, the company relied heavily on Chinese workers hired through brokers.',
      'Payroll records are plain, but they matter. They show who worked, who was paid, and the terms behind the finished railroad.',
    ],
    gallery: [
      {
        imageUrl: assetPrimary(
          'chinese-immigrants-railroad-gettyimages-514881902.avif'
        ),
        imageAlt:
          'Historical photograph of Chinese railroad workers along the line with hand tools and track materials',
        caption:
          'Sierra grade work: tools, ties, and crews doing much of the heavy labor.',
        modalTitle: 'Chinese railroad workers with tools and track materials',
        modalYear: 'c. 1865 to 1869',
        modalTranscript:
          '**Chinese crews** carried much of the difficult **Sierra** work: **grading**, **track**, and **supply**. Many were hired through labor brokers as the **Central Pacific** pushed east from California.',
      },
      {
        imageUrl: assetPrimary(
          'railroad-chinese-immigrants-gettyimages-Sierra-Nevada.avif'
        ),
        imageAlt:
          'Historical photograph of railroad construction in the Sierra Nevada mountains',
        caption: 'Powder, cold, and hard rock behind the celebration images.',
        modalTitle: 'Sierra Nevada railroad construction',
        modalYear: 'c. 1865 to 1869',
        modalTranscript:
          '**Cuts**, **fills**, tunnel headings, **Sierra** weather, **black powder**, slides, and frost were part of the work behind the polished railroad images.',
      },
      {
        imageUrl: assetPrimary('chinese-workers.jpg'),
        imageAlt:
          'Historical photograph of Chinese railroad workers with tools along the track',
        caption: 'On the grade: workers, tools, ties, and contractor pace.',
        modalTitle: 'Chinese workers on the grade (primary-source print)',
        modalYear: 'c. 1860s',
        modalTranscript:
          'This print shows **Chinese** workers on the **grade** with **tools** and **ties**. The pace came from **contractors** and **Charles Crocker**’s hiring system on the **Central Pacific**.',
      },
    ],
    galleryTitle: 'On the line',
    perspectives: {
      title: 'For context',
      body: [
        'Historians often cite **10,000 or more** Chinese workers at peak, with a large share of **CP** labor on the western half. Ledgers also show **unequal pay** and **segregated camps**.',
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
        'This January 1864 **Central Pacific** payroll came from company office work in **Sacramento** or **San Francisco**, not from a camp ledger. **Chinese marks** appear beside Euro-American names. The columns help historians compare wages and trace **who built the western end**.',
      kioskTranscript:
        'Office payroll for one January: **names**, **days**, and **Chinese marks** beside English names.',
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
      'Engineering turned the authorized route into roadbed: grades, bridges, cuts, tunnels, and water stops.',
    engineeringSpotlight: 'dodge',
    body: [
      'From **1866**, **Grenville M. Dodge** led **Union Pacific** engineering work: surveys, bridges, water stops, and arguments over where the line should run.',
      'On the **Sierra** side, **Central Pacific** crews used **nitroglycerin**, **black powder**, and large **timber trestles**. The tech panel summarizes that work.',
      'Survey books and plates turned legal language into lines on paper: rivers, **land-grant** widths, and station points. On the ground, those lines shaped access and land claims.',
    ],
    primarySource: {
      shortLabel: 'Alfred A. Hart, Bloomer Cut stereograph',
      fullTitle: 'View in Bloomer Cut, near Auburn, 63 feet high',
      year: 'c. 1866',
      imageUrl: assetPrimary('hart-bloomer-cut-stereograph.jpg'),
      imageAlt:
        'Stereograph by Alfred A. Hart: deep railroad cut through rock at Bloomer Cut on the Central Pacific line',
      transcript:
        'Hart’s stereo cards marketed the **Central Pacific** as an engineering achievement. **Bloomer Cut** shows powder, drills, and workers deep in granite. Dodge’s **Field Log** gives the **UP** side of the same problem.',
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
      'Utah labor linked local organization, outside railroad money, and the race toward Promontory.',
    body: [
      'In **1868**, **Brigham Young**’s **Union Pacific** contract put Utah workers on grades in **Echo** and **Weber** Canyons after drought reduced farm work. **Bishops** organized work sections, much as they had organized irrigation labor.',
      'The **UP** often failed to deliver promised **tools**. **Young** pressed company officers by telegraph and sometimes covered shortages himself. With **Central Pacific** crews nearby, many Latter-day Saints earned wages on **either** line toward **Promontory**.',
    ],
    perspectives: {
      title: 'For context',
      body: [
        'Utah State’s digital exhibit connects the **1868** contract to canyon construction and the race to join the rails, using contracts, telegrams, and company correspondence.',
      ],
    },
    primarySource: {
      ...UTAH_LABOR_STEREO_ECHO_CAMP,
      shortLabel: 'Utah corridor: stereographs & contract context',
      fullTitle:
        'Weber Canyon trestle; Echo Canyon camp; Brigham Young and the 1868 Union Pacific agreement',
      year: 'c. 1868 to 1869',
      transcript:
        'Use **Enlarge** on each stereograph for fuller captions. **Young**’s **1868** contract put Utah workers on **Echo** and **Weber** grades. Camp views and the Weber trestle show where **bishop-led** labor met **UP** steel.',
      kioskTranscript:
        '**Profile** shows **Young**’s contracting role. **Enlarge** each stereograph for **Weber** and **Echo**.',
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
      'Federal **subsidies** rewarded mileage, so speed became part of the race.',
    body: [
      '**Land** and **bonds** rewarded track laid, not delay. The **UP** pushed across the plains while **CP** crews worked through the **Sierra**, and company leaders argued over the meeting point.',
      'In **April 1869**, the companies settled on **Promontory Summit**. A few days earlier, **Charles Crocker**’s crews laid **ten miles of rail in one day**. It was partly public theater, but it also required careful coordination.',
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
        'Images like this appeared in newspapers and albums near the end of construction. **Handcars**, **rails**, and crews still mattered while **Promontory** and the **ten-mile** record drew attention.',
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
      '**Promontory** marked completion, but it did not settle the questions of labor, cost, land, or memory.',
    body: [],
    bodySections: [
      {
        title: 'What happened',
        paragraphs: [
          'On **May 10, 1869**, locomotives met at **Promontory Summit**, Utah Territory. Officials staged the last spike for the cameras, and Andrew J. Russell framed the scene for a national audience.',
        ],
      },
      {
        title: 'Why it mattered',
        paragraphs: [
          'The image promoted **national reunion through steel**, but it was staged. The **Golden Spike** compressed years of **powder**, **payroll**, and **politics** into one public moment.',
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
        'Russell’s photograph presents **unity through infrastructure**. Look at who is centered, who is missing, and what the frame asks viewers to remember.',
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
      '**Aftermath** continued after the ceremony. Markets, land, labor, and memory kept changing.',
    body: [
      'Completed track moved western **timber**, **ore**, **cattle**, and **grain** on faster schedules and tied markets more tightly together. Much of the gain went to **bondholders**, railroad companies, and **shippers**.',
      'Telegraph wires let news move faster than steam. The word **Done** became a simple message for a very complicated change in **land**, **labor**, and **law**.',
      'For many **Plains** nations, the line came with **Army posts**, **reservations**, and pressure on **bison** herds that sustained whole economies. The railroad’s history includes growth, broken treaties, and lasting disruption.',
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
        'Accounts often remember a short wire: **Done**. This facsimile isolates the word; the Park Service link gives the ceremony context.',
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
