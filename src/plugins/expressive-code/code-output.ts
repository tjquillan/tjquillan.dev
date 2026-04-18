import type { Element } from "@expressive-code/core/hast";

import { AttachedPluginData, definePlugin } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";

// Supported output marker comment patterns by language family
const OUTPUT_PATTERNS = [
  /^\/\/\s*\[output\]\s*$/, // JS, TS, Go, Java, C, Rust, Swift
  /^#\s*\[output\]\s*$/, // Python, Ruby, Bash, YAML, TOML
  /^<!--\s*\[output\]\s*-->\s*$/, // HTML, XML, Markdown
  /^\/\*\s*\[output\]\s*\*\/\s*$/, // CSS, Less, Sass block comments
  /^--\s*\[output\]\s*$/, // SQL, Haskell, Lua
  /^%\s*\[output\]\s*$/, // LaTeX, Erlang
];

interface BlockOutputState {
  splitAtLine: number;
}

const blockState = new AttachedPluginData<BlockOutputState | null>(() => null);

function isEcLine(node: unknown): node is Element {
  if (!node || typeof node !== "object") return false;
  const el = node as Element;
  return (
    el.type === "element" &&
    el.tagName === "div" &&
    Array.isArray(el.properties?.className) &&
    (el.properties.className as string[]).includes("ec-line")
  );
}

function findElement(root: Element, tag: string): Element | null {
  if (root.tagName === tag) return root;
  for (const child of root.children) {
    if (child.type === "element") {
      const found = findElement(child, tag);
      if (found) return found;
    }
  }
  return null;
}

function findParentOf(root: Element, target: Element): Element | null {
  for (const child of root.children) {
    if (child === target) return root;
    if (child.type === "element") {
      const found = findParentOf(child, target);
      if (found) return found;
    }
  }
  return null;
}

export function codeOutputPlugin() {
  return definePlugin({
    name: "Code Output",

    baseStyles: ({ cssVar }) => {
      const border = cssVar("borderColor");
      const bg = cssVar("codeBackground");
      const radius = cssVar("borderRadius");
      const width = cssVar("borderWidth");

      return `
        /* Flatten the bottom corners of the code pre so it connects flush to the output wrapper */
        .has-output > pre {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        /*
         * The output wrapper carries its own matching border on the sides and bottom.
         * Both the <pre> and this wrapper are unsized block children of the figure,
         * so they share the same content width and their borders sit at identical
         * x-positions with no extra margins needed.
         * border-top is omitted — the code pre's bottom border is the separator.
         */
        .ec-output-wrapper {
          overflow: hidden;
          border-inline: ${width} solid ${border};
          border-bottom: ${width} solid ${border};
          border-bottom-left-radius: calc(${radius} + ${width});
          border-bottom-right-radius: calc(${radius} + ${width});
        }

        /* The output pre inherits the border rule from .expressive-code pre — remove it
           so the wrapper's border is the sole outline for the output section. */
        .ec-output-pre {
          background-color: color-mix(in srgb, ${bg} 72%, #000000) !important;
          border: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
        }

        .ec-output-pre code {
          background-color: transparent !important;
        }
      `;
    },

    hooks: {
      preprocessCode({ codeBlock }) {
        const lines = codeBlock.getLines();
        for (let i = 0; i < lines.length; i++) {
          const text = lines[i].text.trim();
          if (OUTPUT_PATTERNS.some((p) => p.test(text))) {
            blockState.setFor(codeBlock, { splitAtLine: i });
            codeBlock.deleteLine(i);
            break;
          }
        }
      },

      postprocessRenderedBlock({ codeBlock, renderData }) {
        const state = blockState.getOrCreateFor(codeBlock);
        if (!state) return;

        const { splitAtLine } = state;
        const { blockAst } = renderData;

        const pre = findElement(blockAst, "pre");
        if (!pre) return;

        const code = pre.children.find(
          (c): c is Element =>
            c.type === "element" && (c as Element).tagName === "code",
        ) as Element | undefined;
        if (!code) return;

        // Find the child index in code.children where output lines begin
        let linesSeen = 0;
        let splitIdx = code.children.length;

        for (let i = 0; i < code.children.length; i++) {
          if (isEcLine(code.children[i])) {
            if (linesSeen === splitAtLine) {
              splitIdx = i;
              break;
            }
            linesSeen++;
          }
        }

        if (splitIdx === code.children.length) return;

        const outputChildren = code.children.splice(splitIdx);

        const outputPreProps = { ...(pre.properties ?? {}) };
        delete outputPreProps.tabIndex;
        outputPreProps.className = [
          ...((outputPreProps.className as string[]) ?? []),
          "ec-output-pre",
        ];

        const outputPre: Element = {
          type: "element",
          tagName: "pre",
          properties: outputPreProps,
          children: [
            {
              type: "element",
              tagName: "code",
              properties: { ...(code.properties ?? {}) },
              children: outputChildren,
            },
          ],
        };

        const outputWrapper: Element = h("div.ec-output-wrapper", [outputPre]);

        const preParent = findParentOf(blockAst, pre) ?? blockAst;
        const preIdxInParent = preParent.children.indexOf(pre as never);
        preParent.children.splice(preIdxInParent + 1, 0, outputWrapper);

        const existing = (blockAst.properties?.className as string[]) ?? [];
        if (!existing.includes("has-output")) {
          blockAst.properties = {
            ...blockAst.properties,
            className: [...existing, "has-output"],
          };
        }
      },
    },
  });
}
