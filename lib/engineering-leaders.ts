import { assetPrimary } from '@/lib/kiosk-content'

export type EngineeringLeaderId = 'judah' | 'dodge' | 'crocker'

/** Optional field-log “primary source” block (defaults to Dale Creek Trestle photograph). */
export type EngineeringFieldLogSource = {
  shortLabel: string
  year?: string
  imageUrl: string
  imageAlt: string
  transcript: string
  archiveUrl?: string
  archiveName?: string
  /** Panel heading for this block (e.g. map vs instrument). */
  sectionHeading?: string
  /** Wide strip: fixed height, natural width, scroll horizontally in the modal. */
  horizontalScroll?: boolean
}

export type EngineeringLeader = {
  id: EngineeringLeaderId
  name: string
  epithet: string
  /** Approximate span of greatest impact on the transcontinental lines (for timeline context). */
  timelineEra: string
  roleBadge: string
  imageUrl: string
  imageAlt: string
  challenge: string
  /** When set, the Field Log modal uses this instead of the shared Dale Creek Trestle photograph. */
  fieldLogSource?: EngineeringFieldLogSource
  /** When true, no primary-source block (image + caption) is shown in the field log. */
  fieldLogOmitPrimarySource?: boolean
  /** Optional closing line (e.g. after challenge when primary source is omitted). */
  fieldLogCoda?: string
}

/** Default field-log primary source (Dodge): Dale Creek Trestle photograph. */
export const HART_BLOOMER_SOURCE: EngineeringFieldLogSource = {
  shortLabel: 'Andrew J. Russell, Dale Creek Trestle',
  year: 'ca. 1868',
  sectionHeading: 'Primary source',
  imageUrl: assetPrimary('dale-creek-bridge-russell.jpg'),
  imageAlt:
    'Andrew J. Russell photograph of the original wooden Dale Creek Trestle spanning a rocky valley on the Union Pacific line',
  transcript:
    'Andrew J. Russell’s photograph of the original wooden **Dale Creek Trestle**, ca. **1868**.',
  archiveUrl:
    'https://www.nga.gov/artworks/226483-plate-8-dale-creek-bridge-above',
  archiveName: 'National Gallery of Art',
}

export function engineeringLeaderById(
  id: EngineeringLeaderId
): EngineeringLeader | undefined {
  return ENGINEERING_LEADERS.find(l => l.id === id)
}

/** Chronological by peak influence on the transcontinental push: Judah, Crocker (CP), Dodge (UP). */
export const ENGINEERING_LEADERS: EngineeringLeader[] = [
  {
    id: 'judah',
    name: 'Theodore Judah',
    epithet: 'The Dreamer',
    timelineEra: 'c. 1860 to 1863',
    roleBadge: 'Chief Engineer, Central Pacific',
    imageUrl: assetPrimary('CPRR_Chief_Engineer_Theodore_D._Judah.jpg'),
    imageAlt:
      'Portrait of Theodore D. Judah, chief engineer of the Central Pacific Railroad',
    challenge:
      'Judah surveyed for the Sacramento Valley Railroad and kept pressing for a route the Sierra could hold: steep grades, snow, granite, and skeptical investors included. His surveys, maps, and lobbying helped turn a proposed line into a charter and right-of-way. He died in 1863, before others finished the climb he had argued was possible.',
    fieldLogSource: {
      shortLabel: 'Central Pacific Railroad, proposed alignment (manuscript)',
      year: '1861',
      imageUrl: assetPrimary('judah-map.jpg'),
      imageAlt:
        'Long horizontal manuscript map: Theodore Judah’s proposed Central Pacific alignment across the Sierra with red ink route line',
      sectionHeading: 'Proposed alignment map',
      horizontalScroll: true,
      transcript:
        'Filed with the Secretary of State in Sacramento in 1861: four sections on one rolled sheet, ink on linen. The catalogued original is about 77 cm tall and 20 m long end to end, roughly 66 ft unrolled. Scale: 1 in. = 400 ft. The red line is Judah’s route; parts were not built exactly on this alignment.',
      archiveUrl: 'https://purl.stanford.edu/gh822ms4734',
      archiveName: 'Stanford Digital Repository',
    },
  },
  {
    id: 'crocker',
    name: 'Charles Crocker',
    epithet: 'The Organizer',
    timelineEra: 'c. 1863 to 1869',
    roleBadge: 'Construction chief, Central Pacific',
    imageUrl: assetPrimary('charles-crocker.jpg'),
    imageAlt:
      'Portrait of Charles Crocker, Central Pacific construction leader',
    challenge:
      'On **April 28, 1869**, **Crocker** took up a **$10,000** wager with **Union Pacific** and set out to lay a record stretch of track in one **12-hour** shift. Thousands of Chinese workers and a crew of eight Irish rail handlers moved in sequence: teams lifted rails, gauged the line, and spiked track toward **Promontory**.',
    fieldLogSource: {
      shortLabel: 'Central Pacific, “Ten miles in one day” sign',
      year: '1869',
      imageUrl: assetPrimary('crocker-ten-miles-one-day-1869.png'),
      imageAlt:
        'Historical photograph of a wooden sign reading “10 miles of track laid in one day, April 28th 1869,” beside new Central Pacific rails in Utah',
      transcript:
        'Central Pacific crews marked their **April 28, 1869** record with this posted sign: **10 miles** of track laid in a single **12-hour** shift. The photograph shows fresh rail stretching toward **Promontory** just days before the lines met.',
      archiveUrl: 'https://www.hmdb.org/m.asp?m=100050',
      archiveName: 'Historical Marker Database (10 Miles of Track)',
    },
  },
  {
    id: 'dodge',
    name: 'Grenville M. Dodge',
    epithet: 'The General',
    timelineEra: 'c. 1866 to 1869',
    roleBadge: 'Chief Engineer, Union Pacific',
    imageUrl: assetPrimary('grenville-dodge-acw-winter-2023-scaled.webp'),
    imageAlt: 'Portrait of Grenville M. Dodge in military-style dress',
    challenge:
      'Dodge brought wartime logistics to railroad engineering. Survey crews worked ahead of the railhead, bridges and water stops had to be planned in order, and moving towns followed close behind. He also defended the grade against political pressure to reroute the line.',
  },
]
