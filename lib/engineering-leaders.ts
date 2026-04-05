import { assetPrimary } from '@/lib/kiosk-content'

export type EngineeringLeaderId = 'judah' | 'dodge' | 'crocker'

/** Optional field-log “primary source” block (defaults to Bloomer Cut Hart stereograph). */
export type EngineeringFieldLogSource = {
  shortLabel: string
  year?: string
  imageUrl: string
  imageAlt: string
  transcript: string
  archiveUrl?: string
  archiveName?: string
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
  /** When set, the Field Log modal uses this instead of the shared Bloomer Cut stereograph. */
  fieldLogSource?: EngineeringFieldLogSource
}

/** Shared Alfred A. Hart stereograph (Bloomer Cut) for Field Log + kiosk primary source. */
export const HART_BLOOMER_SOURCE: EngineeringFieldLogSource = {
  shortLabel: 'Alfred A. Hart, Bloomer Cut stereograph',
  year: 'c. 1866',
  imageUrl: assetPrimary('hart-bloomer-cut-stereograph.jpg'),
  imageAlt:
    'Stereograph by Alfred A. Hart: deep railroad cut through rock at Bloomer Cut, Central Pacific line',
  transcript:
    'Alfred A. Hart’s Central Pacific stereographs marketed the western line as a modern wonder—Bloomer Cut became an icon of black powder, drills, and muscle applied to Sierra granite. The same image backs several Field Logs in this kiosk as a shared picture of survey, grade, and blast.',
  archiveUrl: 'https://www.loc.gov/pictures/item/2005682864/',
  archiveName: 'Library of Congress Prints & Photographs',
}

export function engineeringLeaderById(
  id: EngineeringLeaderId
): EngineeringLeader | undefined {
  return ENGINEERING_LEADERS.find(l => l.id === id)
}

/** Chronological by peak influence on the transcontinental push: Judah → Crocker (CP) → Dodge (UP). */
export const ENGINEERING_LEADERS: EngineeringLeader[] = [
  {
    id: 'judah',
    name: 'Theodore Judah',
    epithet: 'The Dreamer',
    timelineEra: 'c. 1860–1863',
    roleBadge: 'Chief Engineer, Central Pacific',
    imageUrl: assetPrimary('CPRR_Chief_Engineer_Theodore_D._Judah.jpg'),
    imageAlt:
      'Portrait of Theodore D. Judah, chief engineer of the Central Pacific Railroad',
    challenge:
      'Judah obsessed over a practicable route through the Sierra crest—roughly 7,000 ft of elevation, snow, and granite where investors saw folly. His surveys and lobbying helped turn “Crazy Judah’s” line into a charter and a right-of-way before his early death in 1863; others finished the climb he proved possible.',
    fieldLogSource: {
      shortLabel: 'Theodolite — survey instrument',
      year: '19th century',
      imageUrl: assetPrimary('theodolite_pic2_size1.webp'),
      imageAlt:
        'Vintage theodolite surveying instrument on a tripod, used for measuring angles and grades',
      transcript:
        'Theodolites let engineers measure horizontal and vertical angles with precision—exactly the kind of work Judah did when he argued a Sierra crossing was possible. Field parties carried instruments like this through passes and canyons long before the first rail reached the mountains.',
    },
  },
  {
    id: 'crocker',
    name: 'Charles Crocker',
    epithet: 'The Organizer',
    timelineEra: 'c. 1863–1869',
    roleBadge: 'Construction chief, Central Pacific',
    imageUrl: assetPrimary('charles-crocker.jpg'),
    imageAlt:
      'Portrait of Charles Crocker, Central Pacific construction leader',
    challenge:
      'Crocker answered the Sierra labor crisis by recruiting thousands of Chinese workers through contractors—managing pay, camps, and brutal winter pushes toward the summit. His organization turned Crocker’s “pets” (as some crews called the Chinese workforce) into the muscle behind the Summit tunnels.',
  },
  {
    id: 'dodge',
    name: 'Grenville M. Dodge',
    epithet: 'The General',
    timelineEra: 'c. 1866–1869',
    roleBadge: 'Chief Engineer, Union Pacific',
    imageUrl: assetPrimary('grenville-dodge-acw-winter-2023-scaled.webp'),
    imageAlt: 'Portrait of Grenville M. Dodge in military-style dress',
    challenge:
      'A Union Army general who treated track as a campaign: Dodge coordinated survey parties, defended the grade against political pressure, and pushed the Union Pacific across the Great Plains—logistics of ties, rails, water, and “hell on wheels” towns moving with the railhead.',
  },
]
