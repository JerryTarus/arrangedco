import { Node, mergeAttributes } from "@tiptap/core";

export const AffiliateCard = Node.create({
  name: "affiliateCard",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      productName: { default: "" },
      productImage: { default: null },
      price: { default: null },
      merchant: { default: null },
      affiliateSlug: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=affiliate-card]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "affiliate-card" })];
  },
});
