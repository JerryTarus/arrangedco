import { Node, mergeAttributes } from "@tiptap/core";

export const ComparisonTableNode = Node.create({
  name: "comparisonTable",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      rows: { default: [] },
      columns: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=comparison-table]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "comparison-table" })];
  },
});
