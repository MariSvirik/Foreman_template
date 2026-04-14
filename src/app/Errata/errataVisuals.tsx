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

/** Match advisory / severity column icon scale (EnhancementIcon defaults smaller in some builds). */
const typeAdvisoryIconStyle: React.CSSProperties = {
  width: 'var(--pf-v5-global--icon--FontSize--md, 1.125rem)',
  height: 'var(--pf-v5-global--icon--FontSize--md, 1.125rem)',
  flexShrink: 0,
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
        <SecurityIcon style={typeAdvisoryIconStyle} />
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
        <BugIcon style={typeAdvisoryIconStyle} />
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
        <EnhancementIcon style={typeAdvisoryIconStyle} />
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
      <SecurityIcon style={typeAdvisoryIconStyle} />
      <span>Security</span>
    </Flex>
  ) : (
    <Flex
      alignItems={{ default: 'alignItemsCenter' }}
      spaceItems={{ default: 'spaceItemsSm' }}
      style={nowrapRow}
    >
      <BugIcon style={typeAdvisoryIconStyle} />
      <span>Bugfix</span>
    </Flex>
  );
}

/** Reference UI: colored icons only; labels stay black. */
const labelBlack = 'var(--pf-v5-global--Color--100, #151515)';

/** Icon-only tints (Lightspeed / console reference). */
function severityIconColor(severityLabel: string): string {
  const u = severityLabel.toLowerCase();
  if (u === 'none' || u === 'n/a') {
    return '#2b9af3';
  }
  switch (severityLabel) {
    case 'Critical':
      return '#a30000';
    case 'Important':
      return '#c4610a';
    case 'Moderate':
      return '#f0ab00';
    case 'Minor':
      return '#0066cc';
    default:
      return labelBlack;
  }
}

const severityIconDimensions: React.CSSProperties = {
  width: 'var(--pf-v5-global--icon--FontSize--md, 1.125rem)',
  height: 'var(--pf-v5-global--icon--FontSize--md, 1.125rem)',
  flexShrink: 0,
};

/** PatternFly severity icons + label — icon colored, text black. */
export function ErrataSeverityIconLabel({ severityLabel }: { severityLabel: string }) {
  const u = severityLabel.toLowerCase();
  const iconColor = severityIconColor(severityLabel);
  const rowStyle: React.CSSProperties = { ...nowrapRow, color: labelBlack };
  if (u === 'none' || u === 'n/a') {
    return (
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        style={rowStyle}
      >
        <SeverityNoneIcon style={{ ...severityIconDimensions, color: iconColor }} />
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
          style={rowStyle}
        >
          <SeverityCriticalIcon style={{ ...severityIconDimensions, color: iconColor }} />
          <span>Critical</span>
        </Flex>
      );
    case 'Important':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={rowStyle}
        >
          <SeverityImportantIcon style={{ ...severityIconDimensions, color: iconColor }} />
          <span>Important</span>
        </Flex>
      );
    case 'Moderate':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={rowStyle}
        >
          <SeverityModerateIcon style={{ ...severityIconDimensions, color: iconColor }} />
          <span>Moderate</span>
        </Flex>
      );
    case 'Minor':
      return (
        <Flex
          alignItems={{ default: 'alignItemsCenter' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          style={rowStyle}
        >
          <SeverityMinorIcon style={{ ...severityIconDimensions, color: iconColor }} />
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
