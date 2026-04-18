import type { Element } from "@expressive-code/core/hast";

import {
  AttachedPluginData,
  createInlineSvgUrl,
  definePlugin,
} from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";
import playerPlayIcon from "@tabler/icons/outline/player-play.svg?raw";

const RUN_META_RE = /\brun=\{([^}]+)\}/;

interface BlockRunState {
  url: string;
}

const blockState = new AttachedPluginData<BlockRunState | null>(() => null);

function findElementByClass(root: Element, className: string): Element | null {
  if (
    root.type === "element" &&
    Array.isArray(root.properties?.className) &&
    (root.properties.className as string[]).includes(className)
  ) {
    return root;
  }
  for (const child of root.children) {
    if (child.type === "element") {
      const found = findElementByClass(child as Element, className);
      if (found) return found;
    }
  }
  return null;
}

export function codeRunPlugin() {
  const icon = createInlineSvgUrl(playerPlayIcon);

  return definePlugin({
    name: "Code Run",

    baseStyles: () => `
      .expressive-code .copy a.run {
        position: relative;
        align-self: flex-end;
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 0.2rem;
        z-index: 1;
        cursor: pointer;
        display: block;
        text-decoration: none;
        transition-property: opacity, background, border-color;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .expressive-code .copy a.run div {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: var(--ec-frm-inlBtnBg);
        opacity: var(--ec-frm-inlBtnBgIdleOpa);
        transition-property: inherit;
        transition-duration: inherit;
        transition-timing-function: inherit;
      }

      .expressive-code .copy a.run::before {
        content: "";
        position: absolute;
        pointer-events: none;
        inset: 0;
        border-radius: inherit;
        border: var(--ec-brdWd) solid var(--ec-frm-inlBtnBrd);
        opacity: var(--ec-frm-inlBtnBrdOpa);
      }

      .expressive-code .copy a.run::after {
        content: "";
        position: absolute;
        pointer-events: none;
        inset: 0;
        background-color: var(--ec-frm-inlBtnFg);
        mask-image: ${icon};
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
        margin: 0.475rem;
        line-height: 0;
      }

      .expressive-code .copy a.run:hover,
      .expressive-code .copy a.run:focus:focus-visible {
        opacity: 1;
      }

      .expressive-code .copy a.run:hover div,
      .expressive-code .copy a.run:focus:focus-visible div {
        opacity: var(--ec-frm-inlBtnBgHoverOrFocusOpa);
      }

      .expressive-code .copy a.run:active div {
        opacity: var(--ec-frm-inlBtnBgActOpa);
      }

      @media (hover: hover) {
        .expressive-code .copy a.run {
          opacity: 0;
          width: 2rem;
          height: 2rem;
        }

        .expressive-code .frame:hover .copy a.run:not(:hover),
        .expressive-code .frame:focus-within :focus-visible ~ .copy a.run:not(:hover) {
          opacity: 0.75;
        }
      }
    `,

    hooks: {
      preprocessCode({ codeBlock }) {
        const match = RUN_META_RE.exec(codeBlock.meta);
        if (match) {
          blockState.setFor(codeBlock, { url: match[1] });
        }
      },

      postprocessRenderedBlock({ codeBlock, renderData }) {
        const state = blockState.getOrCreateFor(codeBlock);
        if (!state) return;

        const { blockAst } = renderData;

        const copyDiv = findElementByClass(blockAst, "copy");
        if (!copyDiv) return;

        const runButton = h(
          "a.run",
          {
            href: state.url,
            target: "_blank",
            rel: "noopener noreferrer",
            title: "Run",
          },
          [h("div", {})],
        );

        // Insert before the copy button (after any aria-live divs)
        const copyBtnIdx = copyDiv.children.findIndex(
          (c) => c.type === "element" && (c as Element).tagName === "button",
        );
        const insertIdx =
          copyBtnIdx !== -1 ? copyBtnIdx : copyDiv.children.length;
        copyDiv.children.splice(insertIdx, 0, runButton);
      },
    },
  });
}
