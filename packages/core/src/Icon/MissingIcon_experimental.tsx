// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file MissingIcon_experimental.tsx
 * @input Uses React SVG props
 * @output Exports MissingIcon_experimental, a plain dashed-square placeholder
 *   icon, and MissingIconProps
 * @position Core implementation; exported by index.ts, tested by
 *   MissingIcon_experimental.test.tsx. The CLI writes it into copied code for an icon that
 *   no icon set in the project's list has.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Icon/MissingIcon_experimental.doc.mjs (props, usage)
 * - /packages/core/src/Icon/MissingIcon_experimental.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Icon/index.ts (exports if types change)
 * - /packages/cli/assets/templates/blocks/components/Icon/ (showcase blocks)
 */

import React, {type SVGProps} from 'react';

/** Props for {@link MissingIcon_experimental}: the props of an `<svg>`. */
export type MissingIconProps = SVGProps<SVGSVGElement>;

/**
 * Whether the props give the icon an accessible name.
 * @param props
 */
function isLabelled(props: MissingIconProps): boolean {
  const label = props['aria-label'];
  return (
    (typeof label === 'string' && label !== '') ||
    props['aria-labelledby'] != null
  );
}

/**
 * A placeholder for an icon that is not available: a plain dashed square in
 * the current text color. It draws no width or height of its own, so CSS
 * sizes it like any other icon component; pass it to `Icon` to get the icon
 * sizes and colors.
 *
 * It is decorative (`aria-hidden`) unless it has an accessible name: with
 * `aria-label` or `aria-labelledby` it is an image (`role="img"`). An
 * explicit `aria-hidden` or `role` always wins.
 *
 * @experimental May change or be removed in a patch release.
 *
 * @example
 * ```
 * import {Icon, MissingIcon_experimental} from '@astryxdesign/core/Icon';
 *
 * <Icon icon={MissingIcon_experimental} size="sm" />
 * ```
 */
export function MissingIcon_experimental(props: MissingIconProps) {
  const labelled = isLabelled(props);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      data-slot="icon"
      data-missing-icon=""
      aria-hidden={labelled ? undefined : true}
      role={labelled ? 'img' : undefined}
      {...props}>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        strokeDasharray="3 2.33"
      />
    </svg>
  );
}

MissingIcon_experimental.displayName = 'MissingIcon_experimental';
