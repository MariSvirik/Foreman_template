export type FileRow = {
  id: string;
  name: string;
  path: string;
  checksum: string;
  detail: string;
};

export function getFileByName(name: string): FileRow | undefined {
  return MOCK_FILES.find((f) => f.name === name);
}

export const MOCK_FILES: FileRow[] = [
  { id: '1', name: 'text.txt', path: 'text.txt', checksum: 'sha256:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', detail: 'Plain text configuration seed file.' },
  { id: '2', name: 'setup.sh', path: 'scripts/setup.sh', checksum: 'sha256:b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', detail: 'Initial provisioning shell script.' },
  { id: '3', name: 'motd', path: 'etc/motd', checksum: 'sha256:c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', detail: 'Message of the day template for managed hosts.' },
  { id: '4', name: 'resolv.conf', path: 'etc/resolv.conf', checksum: 'sha256:d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', detail: 'DNS resolver configuration.' },
  { id: '5', name: 'hosts', path: 'etc/hosts', checksum: 'sha256:e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', detail: 'Static host-name lookup table.' },
  { id: '6', name: 'ntp.conf', path: 'etc/ntp.conf', checksum: 'sha256:f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', detail: 'NTP daemon configuration.' },
  { id: '7', name: 'sshd_config', path: 'etc/ssh/sshd_config', checksum: 'sha256:a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8', detail: 'OpenSSH server configuration.' },
  { id: '8', name: 'limits.conf', path: 'etc/security/limits.conf', checksum: 'sha256:b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9', detail: 'PAM resource limits.' },
  { id: '9', name: 'sysctl.conf', path: 'etc/sysctl.conf', checksum: 'sha256:c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0', detail: 'Kernel parameter overrides.' },
  { id: '10', name: 'logrotate.conf', path: 'etc/logrotate.conf', checksum: 'sha256:d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1', detail: 'Log rotation policy.' },
  { id: '11', name: 'audit.rules', path: 'etc/audit/audit.rules', checksum: 'sha256:e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2', detail: 'Auditd rules for compliance.' },
  { id: '12', name: 'chrony.conf', path: 'etc/chrony.conf', checksum: 'sha256:f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7', detail: 'Chrony time-sync daemon config.' },
];
