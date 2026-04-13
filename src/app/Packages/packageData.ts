export type PackageListRow = {
  id: string;
  nevra: string;
  summary: string;
  applicable: number;
  upgradable: number;
};

export type PackageDetailModel = PackageListRow & {
  description: string;
  installedHosts: number;
  group: string;
  license: string;
  url: string;
  modular: string;
  sourceRpm: string;
  buildHost: string;
  buildTime: string;
  fileSizeLabel: string;
  fileName: string;
  checksum: string;
  checksumType: string;
};

export const MOCK_PACKAGES: PackageListRow[] = [
  {
    id: '1',
    nevra: '0ad-0.0.26-17.fc40.x86_64',
    summary: 'Cross-Platform RTS Game of Ancient Warfare',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '2',
    nevra: '0ad-data-0.0.26-3.fc39.noarch',
    summary: 'The Data Files for 0 AD',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '3',
    nevra: '389-ds-base-1.3.1.6-25.el7.x86_64',
    summary: '389 Directory Server (base)',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '4',
    nevra: '389-ds-base-devel-1.3.1.6-25.el7.x86_64',
    summary: 'Development libraries for 389 Directory Server',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '5',
    nevra: '389-ds-base-libs-1.3.1.6-25.el7.x86_64',
    summary: 'Core libraries for 389 Directory Server',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '6',
    nevra: '389-ds-base-snmp-1.3.1.6-25.el7.x86_64',
    summary: 'SNMP agent for 389 Directory Server',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '7',
    nevra: 'a2ps-4.14-23.el7.x86_64',
    summary: 'Converts text to PostScript for printing',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '8',
    nevra: 'aajohan-comfortaa-fonts-2.004-4.el7.noarch',
    summary: 'Comfortaa TrueType font',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: '9',
    nevra: 'abattis-cantarell-fonts-0.0.25-1.el7.noarch',
    summary: 'Cantarell sans-serif font family',
    applicable: 0,
    upgradable: 0,
  },
  {
    id: 'basesystem',
    nevra: 'basesystem-11-13.el9.noarch',
    summary: 'The skeleton package which defines a simple Red Hat Enterprise Linux system',
    applicable: 0,
    upgradable: 0,
  },
];

const BASESYSTEM_DETAIL: Omit<PackageDetailModel, keyof PackageListRow> = {
  description:
    'Basesystem defines the components of a basic Red Hat Enterprise Linux system (for example, the package installation order to use during bootstrapping). Basesystem should be in every installation of a system, and it should never be removed.',
  installedHosts: 6,
  group: 'Unspecified',
  license: 'Public Domain',
  url: '',
  modular: 'No',
  sourceRpm: 'basesystem-11-13.el9.src.rpm',
  buildHost: 'x86-vm-55.build.eng.bos.redhat.com',
  buildTime: 'August 09, 2021 at 09:47 PM',
  fileSizeLabel: '8.04 KB (8229 Bytes)',
  fileName: 'basesystem-11-13.el9.noarch.rpm',
  checksum: 'f498b0813fa1a825d550e8e3a9e42255eabfa18e6fc96adfc6cc8fa7e16dd513',
  checksumType: 'sha256',
};

function defaultDetailFromRow(row: PackageListRow): Omit<PackageDetailModel, keyof PackageListRow> {
  return {
    description: `${row.summary}. (Synthetic detail text for preview.)`,
    installedHosts: 0,
    group: 'Unspecified',
    license: 'Unknown',
    url: '',
    modular: 'No',
    sourceRpm: `${row.nevra.split('.')[0] ?? 'package'}.src.rpm`,
    buildHost: 'build.example.com',
    buildTime: '—',
    fileSizeLabel: '—',
    fileName: `${row.nevra}.rpm`,
    checksum: '—',
    checksumType: 'sha256',
  };
}

export function getPackageDetail(nevraDecoded: string): PackageDetailModel | undefined {
  const row = MOCK_PACKAGES.find((p) => p.nevra === nevraDecoded);
  if (!row) {
    return undefined;
  }
  if (row.nevra === 'basesystem-11-13.el9.noarch') {
    return { ...row, ...BASESYSTEM_DETAIL };
  }
  return { ...row, ...defaultDetailFromRow(row) };
}
