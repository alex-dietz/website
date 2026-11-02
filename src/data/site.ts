/**
 * Every piece of content on the page lives here. Edit this file, not the markup.
 */

export const site = {
  name: 'Alexander Dietz',
  domain: 'alexanderdietz.eu',
  description: 'Alexander Dietz, PhD student at Erasmus MC and founder of mymun.',
  intro:
    'PhD student at Erasmus MC, working on lung cancer screening: modelling smoking histories and risk to work out who should be eligible.',
} as const;

export type Item = {
  name: string;
  href: string;
  /** Short qualifier shown next to the name, e.g. a place. */
  meta?: string;
  /** One sentence shown under the name. */
  description?: string;
};

export type Section = {
  label: string;
  items: Item[];
};

export const sections: Section[] = [
  {
    label: 'Research',
    items: [
      {
        name: 'LAPIN',
        href: 'https://health.ec.europa.eu/non-communicable-diseases/cancer/europes-beating-cancer-plan-eu4health-financed-projects/projects/lapin_en',
        description:
          'Lung cancer screening and prevention internationally. An EU4Health project under Europe’s Beating Cancer Plan.',
      },
    ],
  },
  {
    label: 'Building',
    items: [
      {
        name: 'mymun',
        href: 'https://mymun.com',
        description: 'The world’s largest platform for Model UN conferences.',
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
        description: 'The largest student-led conference on transatlantic relations.',
      },
      {
        name: 'Aurel Steinert Stiftung',
        href: 'https://aurelsteinert-stiftung.de/',
        meta: 'München',
        description: 'In memory of Aurel Steinert and the values he stood for.',
      },
    ],
  },
  {
    label: 'Elsewhere',
    items: [
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/alexander-dietz/' },
      { name: 'GitHub', href: 'https://github.com/alex-dietz' },
    ],
  },
];
