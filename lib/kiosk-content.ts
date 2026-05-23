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
  /** Optional extra scans cycled in the enlarge modal (defaults to `imageUrl` only). */
  modalViews?: PrimarySourceModalView[]
}

export type PrimarySourceModalView = {
  imageUrl: string
  imageAlt: string
  label: string
}

export function getPrimarySourceModalViews(
  source: PrimarySource
): PrimarySourceModalView[] {
  if (source.modalViews && source.modalViews.length > 0) {
    return source.modalViews
  }
  return [
    {
      imageUrl: source.imageUrl,
      imageAlt: source.imageAlt,
      label: 'View',
    },
  ]
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
  /** Extra narrative + artifacts opened from the key-figure card. */
  detailModal?: {
    paragraphs: string[]
    gallery?: ExhibitGalleryItem[]
    galleryTitle?: string
    archiveUrl?: string
    archiveName?: string
  }
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
      'Before rails reached the mountains, survey parties mapped the West with compasses, chronometers, and barometers, and Judah had to prove the Sierra route could work.',
    engineeringSpotlight: 'judah',
    body: [
      '**Theodore Judah** was chief engineer of the **Sacramento Valley Railroad** when he surveyed a route across the **Sierra** and began seeking investors for a transcontinental line.',
      'In the **1850s**, Congress funded **Pacific Railroad Surveys** from the **Mississippi** to the **Pacific**. Equipped with **Smithsonian** instructions and elite **Parkinson & Frodsham** chronometers, parties fixed longitude and mapped rival routes across the **West**.',
      '**Judah** built on that baseline with localized fieldwork, using transits, barometers, and leveling chains to prove the **Dutch Flat Route** could climb the **Sierra** at a manageable grade. His **maps**, court testimony, and lobbying gave backers something concrete: a northern crossing that could be built if someone paid for it.',
    ],
    gallery: [
      {
        imageUrl: assetPrimary('cp-railroad-survey-siskiyou.jpg'),
        imageAlt:
          'Portrait of Central Pacific Railroad surveyors with their instruments at Sacramento River Canyon',
        caption: 'Survey party with instruments, Sacramento River Canyon.',
        modalTitle: 'Central Pacific Railroad Survey',
        modalYear: 'c. 1888',
        modalTranscript:
          'Portrait of **Central Pacific Railroad** surveyors with their instruments at **Sacramento River Canyon**. While chronometers fixed the **West**’s geographical grid, field parties like this measured local terrain: the step between **Judah**’s **Sierra** surveys and graded roadbed.',
        archiveUrl:
          'http://archives.csuchico.edu/digital/collection/coll11/id/21401',
        archiveName: 'CSU Chico Digital Collections',
      },
    ],
    galleryTitle: 'Survey instruments',
    primarySource: {
      shortLabel: 'Parkinson & Frodsham box chronometer',
      fullTitle: 'Parkinson & Frodsham Box Chronometer',
      year: '19th c.',
      imageUrl: assetPrimary('parkinson-frodsham-chronometer.jpg'),
      imageAlt:
        'Parkinson and Frodsham marine chronometer in its wooden case, viewed at an angle',
      transcript:
        '**Parkinson & Frodsham** marine chronometers were built to keep exact time through temperature swings, first for **British** navigation at sea and then for mapping trackless country on land. Survey teams paired them with celestial readings to fix longitude during the **Pacific Railroad Surveys** (**1853–1855**), producing the baseline maps **Theodore Judah** later used to target the **Sierra Nevada**. On the ground, Judah applied the same mathematical rigor with transits and leveling chains to prove the **Dutch Flat Route** at roughly **105 feet per mile**.',
      archiveUrl:
        'https://timeandnavigation.si.edu/multimedia-asset/marine-chronometer-by-parkinson-frodsham-no-2349',
      archiveName: 'Smithsonian Time and Navigation',
      modalViews: [
        {
          imageUrl: assetPrimary('parkinson-frodsham-chronometer.jpg'),
          imageAlt:
            'Parkinson and Frodsham marine chronometer in its wooden case, viewed at an angle',
          label: 'Wooden case',
        },
        {
          imageUrl: assetPrimary('parkinson-frodsham-chronometer-top.jpg'),
          imageAlt:
            'Parkinson and Frodsham box chronometer dial, viewed from above in its open case',
          label: 'Dial & escapement',
        },
      ],
    },
    backgroundImageUrl: assetPrimary('map_lg.jpg'),
    perspectives: {
      title: 'For context',
      body: [
        'The **Pacific Railroad Surveys** (**1853–1855**) documented multiple geographically viable transcontinental routes in a detailed **twelve-volume** report, anchored by **Parkinson & Frodsham** chronometers that fixed longitude across the **West**. Political **gridlock** over the route’s location followed.',
        'Critics mocked **Theodore Judah** as “Crazy Judah,” but his **Sierra Nevada** surveys, built on federal baseline maps and executed with the same precision, bypassed that stalemate and convinced investors the **Dutch Flat Route** could work.',
      ],
    },
  },
  {
    id: 2,
    timelineAnchor: { year: 1862, month: 7, day: 1 },
    timelineTickLabel: 'Jul\n1862',
    slug: 'decision',
    heading: 'The Decision',
    conceptThread:
      'Secession broke a decade-long route deadlock. In 1862 Lincoln signed a law that turned the railroad from an argument into a funded project.',
    historicalFigure: {
      name: 'Abraham Lincoln',
      epithet: 'The President',
      roleBadge: 'Signed the Pacific Railway Act (1862)',
      imageUrl: assetPrimary('lincoln-seated-loc-2008680391.jpg'),
      imageAlt:
        'Seated portrait of President Abraham Lincoln, facing front, Washington, D.C., January 1864',
      detailModal: {
        paragraphs: [
          'Raised on the **western frontier**, **Abraham Lincoln** sympathized with farmers and miners and followed the push for **river** and **rail** connections. Long before the **White House**, he filed inventions: in **1849** the U.S. Patent Office issued **patent no. 6469** for a rig to lift grounded steamboats over shoals. He is still the only U.S. president to hold a patent.',
          'In **1862**, with the **Civil War** underway, **California** supporters mailed Lincoln a sizable **gold nugget** and a letter wishing him success in preserving the **Union**. The gift arrived as he signed the **Pacific Railway Act**, tying western loyalty to a railroad meant to reach the **Pacific**.',
        ],
        galleryTitle: 'Featured artifacts',
        gallery: [
          {
            imageUrl: assetPrimary('lincoln-patent-model.jpg'),
            imageAlt:
              "Abraham Lincoln's 1849 patent model for buoying vessels over shoals",
            caption: 'Hand-carved patent model, 1849.',
            modalTitle: 'Abraham Lincoln’s patent model (1849)',
            modalYear: '1849',
            modalTranscript:
              'Lincoln’s wooden **patent model** for buoying vessels over shoals, tied to **patent no. 6469** (**1849**). The full-size idea was meant to float stranded steamboats without unloading cargo.',
            archiveUrl: 'https://www.si.edu/spotlight/tcrr/preparation',
            archiveName: 'Smithsonian Institution',
          },
          {
            imageUrl: assetPrimary('lincoln-gold-nugget.jpg'),
            imageAlt:
              'Gold nugget in a presentation box sent to President Lincoln by citizens of San Francisco',
            caption: 'California gold nugget, c. 1862.',
            modalTitle: 'Gold nugget sent to President Lincoln',
            modalYear: '1862–1865',
            modalTranscript:
              'Presentation **gold nugget** mailed from **California** during the **Civil War**, with a letter backing Lincoln and the **Union**. Western gold and railroad politics often moved in the same channels in these years.',
            archiveUrl: 'https://www.si.edu/spotlight/tcrr/preparation',
            archiveName: 'Smithsonian Institution',
          },
        ],
        archiveUrl: 'https://www.si.edu/spotlight/tcrr/preparation',
        archiveName: 'Smithsonian Institution',
      },
    },
    body: [
      'For years, politicians argued whether the line should terminate in the **North** or the **South**. **Secession** in **1860–1861** ended that deadlock; a **northern** route with **Council Bluffs, Iowa** as the eastern terminus moved forward.',
      'In **July 1862**, **Abraham Lincoln** signed the **Pacific Railway Act** while the **Civil War** was underway. **Land grants and bonds** chartered **Union Pacific** and strengthened **Central Pacific** toward one line to the Pacific.',
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
    perspectives: {
      title: 'For context',
      body: [
        'Wartime urgency sharpened the case. **California** had joined the **Union** in **1850**, and leaders in **Washington** worried about keeping the **Pacific** coast connected if fighting dragged on. A railroad promised faster mail, troops, and freight than **Overland** trails could move.',
        'The **1862** statute bundled more than rails: **Government bonds** paid in stages, alternating **land-grant** sections along the right-of-way, and a **telegraph** line to the **Pacific**. Companies could borrow against the promise of future traffic and settlers.',
      ],
    },
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
        imageUrl: assetPrimary('or-n-cut-117-handcar.jpg'),
        imageAlt:
          'Historical photograph of railroad workers standing on a handcar, ca. 1880',
        caption: 'Maintenance crews on a handcar, ca. 1880.',
        modalTitle: 'Railroad workers on a handcar',
        modalYear: 'c. 1880',
        modalTranscript:
          'Track maintenance workers, called **gandy dancers** in railroad slang, patrolled the **Oregon Pacific Railroad** on a **handcar**. Four workers pose on the car in a cut between embankments.',
        archiveUrl:
          'https://content.libraries.wsu.edu/digital/collection/wsuvan1/id/1116/',
        archiveName: 'Oregon Historical Society (via WSU Libraries)',
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
        archiveUrl:
          'https://calisphere.org/item/896f1a5e7a8f3be656aba91c383329df/',
        archiveName: 'Calisphere (California State Library)',
      },
      {
        imageUrl: assetPrimary('cp-tunnel-8-east-portal-stereograph.png'),
        imageAlt:
          'Alfred A. Hart stereograph of a Chinese worker at the east portal heading of Central Pacific Tunnel No. 8 in the Sierra Nevada',
        caption: 'Tunnel heading: east portal, No. 8, in the Sierra.',
        modalTitle:
          'Heading of east portal, Tunnel No. 8 (Central Pacific stereograph)',
        modalYear: 'c. 1866 to 1868',
        modalTranscript:
          'Alfred A. Hart stereograph **204** shows a **Chinese** worker at the **east portal** of **Tunnel No. 8** during **Central Pacific** work in the **Sierra Nevada**. Hart documented construction for the company from **1866** to **1869**.',
        archiveUrl: 'https://www.loc.gov/pictures/resource/stereo.1s00553/',
        archiveName: 'Library of Congress',
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
