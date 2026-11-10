// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'MissingIcon_experimental',
  subComponentOf: 'Icon',
  displayName: 'Missing Icon',
  stability: 'experimental',
  isHiddenFromOverview: true,
  description:
    "Experimental: may change or be removed in a patch release. A placeholder for an icon that is not available: a plain dashed square in the current text color. When a project copies a template and no icon set in its list has an icon for a meaning, the CLI writes this placeholder under the template's own icon name, so the page still builds and the gap is easy to see. Replace it with a real icon. It has no size of its own: pass it to `Icon` (`<Icon icon={MissingIcon_experimental} />`) to get the icon sizes and colors, or size it with CSS. It is decorative unless it has an accessible name.",
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description:
        'Accessible name. With it (or `aria-labelledby`) the icon is an image (`role="img"`); without it the icon is decorative (`aria-hidden`). Through `Icon`, use its `label` prop instead.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Class for the `<svg>`. Use it, or `Icon`, to set the size: the placeholder draws no width or height of its own.',
    },
  ],
  usage: {
    description:
      'Experimental: may change or be removed in a patch release. A visible stand-in for an icon that no icon set in the project has. Copied templates use it; replace it with a real icon from your icon set.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Treat it as a to-do. `astryx doctor` lists each file and meaning that still uses it, with the commands that give it a real icon.',
      },
      {
        guidance: true,
        description:
          'Render it through `Icon`, so it takes the same size and color as the icons around it.',
      },
      {
        guidance: false,
        description:
          'Ship it as a final icon. It marks a gap, not a design choice.',
      },
    ],
  },
  examples: [
    {
      label: 'In place of an icon',
      code: 'import {Icon, MissingIcon_experimental} from \'@astryxdesign/core/Icon\';\n\n<Icon icon={MissingIcon_experimental} size="sm" />',
    },
  ],
};

export const docsZh = {
  name: 'MissingIcon_experimental',
  isHiddenFromOverview: true,
  displayName: 'Missing Icon',
  description:
    '实验性：可能在补丁版本中更改或移除。缺失图标的占位符：当前文字颜色的虚线方框。项目复制模板时，若其图标集列表中没有某个含义的图标，CLI 会以模板自身的图标名写入此占位符，使页面仍可构建且缺口一目了然。请替换为真实图标。它没有自身尺寸：传给 `Icon` 以获得图标尺寸和颜色，或用 CSS 设置尺寸。除非有无障碍名称，否则为装饰性。',
  props: [
    {
      name: 'aria-label',
      type: 'string',
      description:
        '无障碍名称。有该名称（或 `aria-labelledby`）时图标为图像（`role="img"`）；否则为装饰性（`aria-hidden`）。通过 `Icon` 使用时改用其 `label` 属性。',
    },
    {
      name: 'className',
      type: 'string',
      description:
        '`<svg>` 的类名。用它或 `Icon` 设置尺寸：占位符本身不绘制宽高。',
    },
  ],
};

export const docsDense = {
  name: 'MissingIcon_experimental',
  displayName: 'Missing Icon',
  description:
    'experimental placeholder icon: dashed square, currentColor, no own size (use Icon or CSS); decorative unless aria-label/aria-labelledby; CLI writes it for icons no set in the list has',
  propDescriptions: {
    'aria-label': 'accessible name -> role="img"; else aria-hidden',
    className: 'svg class; size via CSS or Icon',
  },
};
