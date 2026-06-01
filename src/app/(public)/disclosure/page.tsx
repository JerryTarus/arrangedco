import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description: "Our affiliate disclosure and Amazon Associates statement.",
});

export default function DisclosurePage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-20 prose prose-neutral">
      <h1>Affiliate Disclosure</h1>
      <p>
        Arranged Co participates in the Amazon Services LLC Associates Program, an
        affiliate advertising program designed to provide a means for sites to earn
        advertising fees by advertising and linking to Amazon.com.
      </p>
      <p>
        We also participate in other affiliate programmes. When you click a link on this
        site and make a purchase, we may earn a commission at no additional cost to you.
      </p>
      <p>
        Our editorial opinions are our own. We only recommend products we genuinely
        believe in, regardless of commission.
      </p>
      <p>
        If you have any questions, please contact us at{" "}
        <a href="mailto:hello@arranged.co">hello@arranged.co</a>.
      </p>
    </section>
  );
}
