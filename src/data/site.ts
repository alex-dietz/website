/**
 * Every piece of content on the page lives here. Edit this file, not the markup.
 */

export const LINKEDIN_URL = 'https://www.linkedin.com/in/alexander-dietz/';

export const site = {
  name: 'Alexander Dietz',
  domain: 'alexanderdietz.eu',
  description: 'Alexander Dietz — PhD student at Erasmus MC, building mymun.',
} as const;

/** The tagline, split so footnote markers can be attached to specific phrases. */
export const tagline = [
  { text: 'PhD student at ' },
  {
    text: 'Erasmus MC',
    note: 'Lung cancer screening: modelling smoking histories and risk to work out who should be eligible.',
  },
] as const;

export type IndexItem = {
  name: string;
  href: string;
  meta?: string;
  note?: string;
};

export type IndexRow = {
  label: string;
  items: IndexItem[];
};

export const rows: IndexRow[] = [
  {
    label: 'Research',
    items: [
      {
        name: 'LAPIN',
        href: 'https://health.ec.europa.eu/non-communicable-diseases/cancer/europes-beating-cancer-plan-eu4health-financed-projects/projects/lapin_en',
        note: 'Lung cancer screening And Prevention INternationally. An EU4Health project under Europe’s Beating Cancer Plan.',
      },
    ],
  },
  {
    label: 'Building',
    items: [
      {
        name: 'mymun',
        href: 'https://mymun.com',
        meta: 'Model UN, at scale',
        note: 'The world’s largest platform for Model UN conferences.',
      },
    ],
  },
  {
    label: 'Volunteering',
    items: [
      {
        name: 'German American Conference',
        href: 'https://germanamericanconference.org/',
        meta: 'Harvard',
        note: 'The largest student-led conference on transatlantic relations.',
      },
      {
        name: 'Aurel Steinert Stiftung',
        href: 'https://aurelsteinert-stiftung.de/',
        meta: 'München',
        note: 'In memory of Aurel Steinert and the values he stood for.',
      },
    ],
  },
  {
    label: 'Elsewhere',
    items: [
      { name: 'LinkedIn', href: LINKEDIN_URL },
      { name: 'GitHub', href: 'https://github.com/alex-dietz' },
    ],
  },
];

/**
 * Peer-review mode annotations. `sel` is resolved against the document at
 * runtime; anything that does not match is skipped silently.
 */
export const reviewNotes: { sel: string; note: string; mark: 'squiggle' | 'strike' | 'circle' }[] = [
  { sel: '[data-review="name"]', note: 'Sp.? Confirm author affiliation.', mark: 'circle' },
  { sel: '[data-review="tagline"]', note: 'Vague. State the contribution.', mark: 'squiggle' },
  { sel: '[data-review="LAPIN"]', note: 'Acronym not expanded at first use.', mark: 'squiggle' },
  { sel: '[data-review="mymun"]', note: 'Conflict of interest — please declare.', mark: 'circle' },
  { sel: '[data-review="German American Conference"]', note: 'Relevant to the central claim?', mark: 'squiggle' },
  { sel: '[data-review="LinkedIn"]', note: 'Reviewer 2: I remain unconvinced.', mark: 'strike' },
  { sel: '[data-review="GitHub"]', note: 'Data availability statement missing.', mark: 'squiggle' },
];
