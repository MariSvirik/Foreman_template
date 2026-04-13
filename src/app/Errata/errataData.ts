/**
 * Shared errata list data — featured rows from product reference + deterministic generated rows.
 */

export type ErrataRow = {
  id: string;
  errataId: string;
  errataType: 'bugfix' | 'security';
  severityLabel: string;
  /** Legacy host counts (detail / filters). */
  applicable: number;
  installable: number;
  /** Shown in “Affected systems” when set; otherwise `applicable` is used. */
  affectedSystems?: number;
  rebootRequired: boolean;
  synopsis: string;
  publishedSort: number;
  detail: string;
};

const PACKAGES = [
  'kernel',
  'openssl',
  'tzdata',
  'httpd',
  'postgresql',
  'zlib',
  'rsync',
  'systemd',
] as const;

/** Reference table rows (Errata list UI). */
const SCREENSHOT_TABLE_ROWS: Omit<ErrataRow, 'id'>[] = [
  {
    errataId: 'RHBA-2026:6837',
    errataType: 'bugfix',
    severityLabel: 'None',
    applicable: 130,
    installable: 12,
    affectedSystems: 130,
    rebootRequired: false,
    synopsis: 'mdadm bug fix and enhancement update',
    publishedSort: new Date('2026-04-07').getTime(),
    detail: 'Bug fix update for mdadm.',
  },
  {
    errataId: 'RHBA-2026:6838',
    errataType: 'bugfix',
    severityLabel: 'None',
    applicable: 75,
    installable: 8,
    affectedSystems: 75,
    rebootRequired: false,
    synopsis: 'NetworkManager bug fix and enhancement update',
    publishedSort: new Date('2026-04-07').getTime(),
    detail: 'Bug fix update for NetworkManager.',
  },
  {
    errataId: 'RHBA-2026:6839',
    errataType: 'bugfix',
    severityLabel: 'None',
    applicable: 75,
    installable: 10,
    affectedSystems: 75,
    rebootRequired: true,
    synopsis: 'systemd bug fix and enhancement update',
    publishedSort: new Date('2026-04-07').getTime(),
    detail: 'Bug fix update for systemd.',
  },
  {
    errataId: 'RHSA-2026:6766',
    errataType: 'security',
    severityLabel: 'Important',
    applicable: 89,
    installable: 5,
    affectedSystems: 89,
    rebootRequired: false,
    synopsis: 'Important: python3.9 security update',
    publishedSort: new Date('2026-04-07').getTime(),
    detail: 'Security update for python3.9.',
  },
  {
    errataId: 'RHSA-2026:6750',
    errataType: 'security',
    severityLabel: 'Important',
    applicable: 927,
    installable: 40,
    affectedSystems: 927,
    rebootRequired: false,
    synopsis: 'Important: gstreamer1 security update',
    publishedSort: new Date('2026-04-07').getTime(),
    detail: 'Security update for gstreamer1.',
  },
  {
    errataId: 'RHSA-2026:6621',
    errataType: 'security',
    severityLabel: 'Moderate',
    applicable: 132,
    installable: 6,
    affectedSystems: 132,
    rebootRequired: false,
    synopsis: 'Moderate: crun security update',
    publishedSort: new Date('2026-04-06').getTime(),
    detail: 'Security update for crun.',
  },
  {
    errataId: 'RHSA-2026:6571',
    errataType: 'security',
    severityLabel: 'Moderate',
    applicable: 938,
    installable: 22,
    affectedSystems: 938,
    rebootRequired: true,
    synopsis: 'Moderate: kernel security update',
    publishedSort: new Date('2026-04-06').getTime(),
    detail: 'Security update for kernel.',
  },
  {
    errataId: 'RHSA-2026:6570',
    errataType: 'security',
    severityLabel: 'Moderate',
    applicable: 67,
    installable: 4,
    affectedSystems: 67,
    rebootRequired: true,
    synopsis: 'Moderate: kernel security update',
    publishedSort: new Date('2026-04-06').getTime(),
    detail: 'Security update for kernel.',
  },
];

function buildRows(): ErrataRow[] {
  const rows: ErrataRow[] = [];

  rows.push({
    id: 'featured-6825',
    errataId: 'RHSA-2026:6825',
    errataType: 'security',
    severityLabel: 'Moderate',
    applicable: 418,
    installable: 3,
    affectedSystems: 418,
    rebootRequired: false,
    synopsis: 'Moderate: rsync security update',
    publishedSort: new Date('2026-04-07').getTime(),
    detail: 'Security update for rsync (CVE-2025-10158).',
  });

  SCREENSHOT_TABLE_ROWS.forEach((r, i) => {
    rows.push({
      id: `ref-table-${i}`,
      ...r,
    });
  });

  for (let i = 0; i < 200; i++) {
    const n = i + 1;
    const prefix = n % 3 === 0 ? 'RHSA' : n % 3 === 1 ? 'RHBA' : 'RHEA';
    const year = 2022 + (n % 5);
    const num = 2000 + ((n * 17) % 7000);
    const errataId = `${prefix}-${year}:${num}`;
    const isBugfix = prefix === 'RHBA' || (prefix === 'RHEA' && n % 2 === 0);
    const errataType: ErrataRow['errataType'] = isBugfix ? 'bugfix' : 'security';
    const pkg = PACKAGES[n % PACKAGES.length];
    let severityLabel: string;
    if (isBugfix) {
      severityLabel = n % 4 === 0 ? 'Moderate' : 'N/A';
    } else {
      severityLabel = ['Moderate', 'Important', 'Critical'][n % 3];
    }
    const applicable = 10 + ((n * 31) % 400);
    const installable = Math.min(applicable, (n * 7) % 200);
    const synopsis = isBugfix
      ? `${pkg} bug fix and enhancement update`
      : `${severityLabel}: ${pkg} security update`;
    const publishedSort = new Date(year, n % 12, (n % 27) + 1).getTime();
    const rebootRequired = (n * 13) % 5 === 0;

    rows.push({
      id: String(n),
      errataId,
      errataType,
      severityLabel,
      applicable,
      installable,
      affectedSystems: applicable,
      rebootRequired,
      synopsis,
      publishedSort,
      detail: `${errataId} — ${synopsis}`,
    });
  }

  return rows;
}

export const ALL_ERRATA_ROWS: ErrataRow[] = buildRows();

export function findErrataByAdvisoryId(advisoryId: string): ErrataRow | undefined {
  return ALL_ERRATA_ROWS.find((r) => r.errataId === advisoryId);
}
