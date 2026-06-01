import { Node, mergeAttributes } from "@tiptap/core";

export const NewsletterBlock = Node.create({
  name: "newsletterBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      headline: { default: "Enjoyed this article?" },
      subtext: { default: "Subscribe to get weekly picks." },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=newsletter-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "newsletter-block" })];
  },
});
