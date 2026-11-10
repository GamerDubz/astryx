// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file An experimental Core component (spec:AST-017 FR27) is never a search
 * result, and `astryx component <Name>` still reads it by the name the
 * caller writes.
 */

import {describe, expect, it} from 'vitest';
import {search} from './search.mjs';
import {component} from '../component/component.mjs';
import {REPO_ROOT} from '../../test-utils/repo-root.mjs';

describe('experimental Core components', () => {
  it('are not search results', async () => {
    const result = await search('missing icon placeholder', {
      cwd: REPO_ROOT,
      limit: 50,
    });
    expect(
      result.data.results.filter(
        (/** @type {any} */ each) =>
          each.domain === 'component' && /MissingIcon/u.test(each.name),
      ),
    ).toEqual([]);
  }, 60_000);

  it('are read by name', async () => {
    const result = /** @type {any} */ (
      await component('MissingIcon_experimental', {cwd: REPO_ROOT})
    );
    expect(result.type).toBe('component.detail');
    expect(JSON.stringify(result.data)).toContain('MissingIcon_experimental');
    expect(JSON.stringify(result.data)).toContain('@astryxdesign/core/Icon');
  }, 60_000);
});
