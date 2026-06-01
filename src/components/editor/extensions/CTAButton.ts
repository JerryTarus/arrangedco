import { Node, mergeAttributes } from "@tiptap/core";

export const CTAButtonNode = Node.create({
  name: "ctaButton",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      label: { default: "View on Amazon" },
      href: { default: "" },
      variant: { default: "primary" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=cta-button]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "cta-button" })];
  },
});
