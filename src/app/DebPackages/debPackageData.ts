export type DebPackageRow = {
  id: string;
  name: string;
  version: string;
  architecture: string;
  applicable: number;
  upgradable: number;
};

export const MOCK_DEB_PACKAGES: DebPackageRow[] = [
  { id: '1', name: 'pdk', version: '2.0.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '2', name: 'pdk', version: '2.1.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '3', name: 'pdk', version: '2.1.1.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '4', name: 'pdk', version: '2.2.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '5', name: 'pdk', version: '2.3.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '6', name: 'pdk', version: '2.4.0.1-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '7', name: 'pdk', version: '2.5.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '8', name: 'pdk', version: '2.6.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '9', name: 'pdk', version: '2.6.1.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '10', name: 'puppet-agent', version: '7.0.0-1focal', architecture: 'amd64', applicable: 3, upgradable: 1 },
  { id: '11', name: 'puppet-agent', version: '7.1.0-1focal', architecture: 'amd64', applicable: 2, upgradable: 0 },
  { id: '12', name: 'puppet-agent', version: '7.2.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '13', name: 'puppetdb', version: '7.10.0-1focal', architecture: 'amd64', applicable: 1, upgradable: 1 },
  { id: '14', name: 'puppetdb', version: '7.11.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '15', name: 'puppetserver', version: '7.9.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '16', name: 'puppetserver', version: '7.10.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '17', name: 'facter', version: '4.2.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '18', name: 'hiera', version: '5.0.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '19', name: 'bolt', version: '3.24.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
  { id: '20', name: 'bolt', version: '3.25.0-1focal', architecture: 'amd64', applicable: 0, upgradable: 0 },
];
