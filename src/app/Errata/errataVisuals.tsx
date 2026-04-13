import * as React from 'react';
import { Flex } from '@patternfly/react-core';
import {
  BugIcon,
  EnhancementIcon,
  PowerOffIcon,
  SecurityIcon,
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
} from '@patternfly/react-icons';
import type { ErrataRow } from '@app/Errata/errataData';

const nowrapRow: React.CSSProperties = {
  flexWrap: 'nowrap',
  minWidth: 0,
};

/**
 * Advisory prefix drives type label (RHSA/RHBA/RHEA), matching Red Hat errata conventions.
 */
export function ErrataTypeIconLabel({ row }: { row: Pick<ErrataRow, 'errataId' | 'errataType'> }) {
  const id = row.errataId;
  if (id.startsWith('RHSA')) {
    return (
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        style={nowrapRow}
      >
        <SecurityIcon />
        <span>Security</span>
      </Flex>
    );
  }
  if (id.startsWith('RHBA')) {
    return (
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        style={nowrapRow}
      >
        <BugIcon />
        <span>Bugfix</span>
      </Flex>
    );
  }
  if (id.startsWith('RHEA')) {
    return (
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        style={nowrapRow}
      >
        <EnhancementIcon />
        <span>Enhancement</span>
      </Flex>
    );
  }
  return row.errataType === 'security' ? (
    <Flex
      alignItems={{ default: 'alignItemsCenter' }}
      spaceItems={{ default: 'spaceItemsSm' }}
      style={nowrapRow}
    >
      <SecurityIcon />
      <span>Security</span>
    </Flex>
  ) : (
    <Flex
      alignItems={{ default: 'alignItemsCenter' }}
      spaceItems={{ default: 'spaceItemsSm' }}
      style={nowrapRow}
    >
      <BugIcon />
      <span>Bugfix</span>
    </Flex>
  );
}

/** PatternFly severity icons + label on one line. */
export function ErrataSeverityIconLabel({ severityLabel }: { severityLabel: string }) {
  const u = severityLabel.toLowerCase();
  if (u === 'none' || u === 'n/a') {
    return (
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        style={nowrapRow}
      >
        <SeverityNoneIcon />
        <span>None</span>
      </Flex>
    );
  }
  switch (severityLabel) {
    case 'Critical':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={nowrapRow}
        >
          <SeverityCriticalIcon />
          <span>Critical</span>
        </Flex>
      );
    case 'Important':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={nowrapRow}
        >
          <SeverityImportantIcon />
          <span>Important</span>
        </Flex>
      );
    case 'Moderate':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={nowrapRow}
        >
          <SeverityModerateIcon />
          <span>Moderate</span>
        </Flex>
      );
    case 'Minor':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={nowrapRow}
        >
          <SeverityMinorIcon />
          <span>Minor</span>
        </Flex>
      );
    default:
      return <span>{severityLabel}</span>;
  }
}

const danger = 'var(--pf-v5-global--danger-color--100, #c9190b)';
const subtle = 'var(--pf-v5-global--Color--200, #6a6e73)';

/**
 * Single flex row so PatternFly DescriptionList inner wrapper does not stack icon + text.
 * Red power icon when reboot is required; muted icon otherwise.
 */
export function ErrataRebootIconLabel({
  rebootRequired,
  label,
}: {
  rebootRequired: boolean;
  label: string;
}) {
  return (
    <Flex
      alignItems={{ default: 'alignItemsCenter' }}
      spaceItems={{ default: 'spaceItemsSm' }}
      style={{ ...nowrapRow, width: '100%' }}
    >
      <PowerOffIcon
        style={{
          color: rebootRequired ? danger : subtle,
          flexShrink: 0,
        }}
        aria-hidden
      />
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
    </Flex>
  );
}
