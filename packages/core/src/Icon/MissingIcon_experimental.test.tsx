// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import React, {createRef} from 'react';
import {Icon} from './Icon';
import {MissingIcon_experimental} from './MissingIcon_experimental';

describe('MissingIcon_experimental', () => {
  it('draws a dashed square in the current color, with no size of its own', () => {
    const {container} = render(<MissingIcon_experimental />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
    expect(svg?.getAttribute('fill')).toBe('none');
    expect(svg?.hasAttribute('width')).toBe(false);
    expect(svg?.hasAttribute('height')).toBe(false);
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    const rect = svg?.querySelector('rect');
    expect(rect?.getAttribute('stroke-dasharray')).toBeTruthy();
  });

  it('is decorative by default', () => {
    const {container} = render(<MissingIcon_experimental />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.hasAttribute('role')).toBe(false);
  });

  it('is an image when it has an accessible name', () => {
    const {container} = render(<MissingIcon_experimental aria-label="Cut" />);
    const svg = container.querySelector('svg');
    expect(svg?.hasAttribute('aria-hidden')).toBe(false);
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Cut');
  });

  it('lets an explicit aria-hidden or role win', () => {
    const {container} = render(
      <MissingIcon_experimental
        aria-label="Cut"
        aria-hidden
        role="presentation"
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(svg?.getAttribute('role')).toBe('presentation');
  });

  it('forwards its ref and other SVG props', () => {
    const ref = createRef<SVGSVGElement>();
    const {container} = render(
      <MissingIcon_experimental ref={ref} className="x" data-test="y" />,
    );
    expect(ref.current).toBe(container.querySelector('svg'));
    expect(ref.current?.getAttribute('class')).toBe('x');
    expect(ref.current?.getAttribute('data-test')).toBe('y');
  });

  it('takes its size and accessibility from Icon, like any icon component', () => {
    const {container, rerender} = render(
      <Icon icon={MissingIcon_experimental} size="sm" />,
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    // Icon sizes a component icon through its size class.
    expect(svg?.getAttribute('class')).toBeTruthy();
    rerender(<Icon icon={MissingIcon_experimental} label="Cut" />);
    const labelled = container.querySelector('svg');
    expect(labelled?.getAttribute('role')).toBe('img');
    expect(labelled?.getAttribute('aria-label')).toBe('Cut');
    expect(labelled?.hasAttribute('aria-hidden')).toBe(false);
  });
});
