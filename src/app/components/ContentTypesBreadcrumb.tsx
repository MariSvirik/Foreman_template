import * as React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';

type ContentTypesBreadcrumbProps = {
  /** Active page label (sentence case), e.g. "Errata" */
  currentPageLabel: string;
};

/**
 * List pages: Content Types → current page (see PF5 custom menus / navigation patterns).
 */
const ContentTypesBreadcrumb: React.FunctionComponent<ContentTypesBreadcrumbProps> = ({
  currentPageLabel,
}) => (
  <div
    style={{
      paddingBottom: spacingMd,
      boxSizing: 'border-box',
    }}
  >
    <Breadcrumb>
      <BreadcrumbItem
        to="/content-types"
        render={({ className, ariaCurrent }) => (
          <Link className={className} to="/content-types" aria-current={ariaCurrent}>
            Content Types
          </Link>
        )}
      />
      <BreadcrumbItem isActive>{currentPageLabel}</BreadcrumbItem>
    </Breadcrumb>
  </div>
);

export { ContentTypesBreadcrumb };
